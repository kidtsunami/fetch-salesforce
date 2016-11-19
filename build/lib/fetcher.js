"use strict";
const querystring = require('querystring');
const events = require('events');
const fetch = require('isomorphic-fetch');
const Promise = require('bluebird');
class Fetcher extends events.EventEmitter {
    constructor(options) {
        super();
        this.options = options;
        this.options.accessToken = undefined;
        this.isRefreshingAccessToken = false;
        this.pendingRequests = [];
    }
    static Create(options) {
        return new Fetcher(options);
    }
    getAccessToken() {
        if (this.options.accessToken) {
            return Promise.resolve(this.options.accessToken);
        }
        else {
            return this.refreshAccessToken();
        }
    }
    refreshAccessToken() {
        this.emit('accessTokenRefreshing');
        let requestURL = this.options.tokenServiceURL;
        let accessToken;
        let fetchBody = {
            grant_type: 'refresh_token',
            refresh_token: this.options.refreshToken,
            client_id: this.options.clientID,
            format: 'json'
        };
        if (this.options.clientSecret) {
            fetchBody.client_secret = this.options.clientSecret;
        }
        let requestOptions = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            cache: 'no-cache',
            body: querystring.stringify(fetchBody)
        };
        let fetchPromise = fetch(requestURL, requestOptions);
        return Promise.resolve(fetchPromise)
            .then(response => response.json())
            .then(response => this.handleGenericErrors(requestURL, requestOptions, response))
            .then((response) => {
            console.info(`New accessToken retrieved`);
            this.emit('accessTokenRefreshed');
            this.options.accessToken = response.access_token;
            return response;
        });
    }
    fetchJSON(requestURL, requestOptions) {
        return new Promise((resolve, reject) => {
            this.addAuthorizationHeaders(requestOptions.headers)
                .then(headers => {
                requestOptions.headers = headers;
                let fetcherRequest = {
                    requestURL: requestURL,
                    requestOptions: requestOptions,
                    resolve: resolve,
                    reject: reject
                };
                console.info('Fetching JSON');
                console.info(fetcherRequest);
                let fetchPromise = fetch(requestURL, requestOptions);
                Promise.resolve(fetchPromise)
                    .then(response => response.json())
                    .then(response => {
                    if (this.isInvalidSession(response)) {
                        console.info(`${this.options.accessToken} is invalid, refreshing!`);
                        this.pendingRequests.push(fetcherRequest);
                        this.refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
                    }
                    else {
                        resolve(this.handleGenericErrors(requestURL, requestOptions, response));
                    }
                });
            });
        });
    }
    addAuthorizationHeaders(headers) {
        return this.getAccessToken()
            .then((accessTokenResponse) => {
            if (headers === undefined) {
                headers = {};
            }
            let authorizedHeader = {
                'Authorization': 'Authorization: Bearer ' + this.options.accessToken
            };
            return Object.assign(headers, authorizedHeader);
        });
    }
    isInvalidSession(response) {
        return Array.isArray(response)
            && response.length > 0
            && response[0].errorCode === 'INVALID_SESSION_ID';
    }
    refreshAccessTokenAndRetryPendingRequests(fetcherRequest) {
        if (!this.isRefreshingAccessToken) {
            this.isRefreshingAccessToken = true;
            console.info('Refreshing token and retrying pending requests');
            this.refreshAccessToken()
                .bind(this)
                .then(() => {
                return this.retryPendingRequests();
            });
        }
        else {
            console.info('Already refreshing token');
        }
    }
    retryPendingRequests() {
        let retryPromises = [];
        console.info(`Attempting to retry ${this.pendingRequests.length} pendingRequests`);
        for (let pendingRequest of this.pendingRequests) {
            retryPromises.push(this.fetchJSON(pendingRequest.requestURL, pendingRequest.requestOptions));
        }
        console.log('Promising all');
        Promise.all(retryPromises)
            .then(responses => {
            for (let requestIndex in responses) {
                let response = responses[requestIndex];
                let pendingRequest = this.pendingRequests[requestIndex];
                console.log('Resolving!!!!');
                pendingRequest.resolve(response);
            }
            console.info('PendingRequests have been retried, cleaning pendingRequests');
            this.pendingRequests = [];
        })
            .catch(error => {
            console.error(`Failed to retry the pending requests`);
            console.error(error);
            throw (error);
        });
        ;
    }
    handleGenericErrors(requestURL, requestOptions, response) {
        if (!response || response.error) {
            let fetchJSONException = {
                requestURL: requestURL,
                requestOptions: requestOptions,
                response: response
            };
            console.error(fetchJSONException);
            throw fetchJSONException;
        }
        else {
            return response;
        }
    }
    revokeAccessToken() {
        if (!this.options.accessToken) {
            throw 'No Access Token to Revoke';
        }
        this.emit('accessTokenRevoking');
        let requestURL = this.options.revokeServiceURL;
        let fetchBody = {
            token: this.options.accessToken
        };
        let requestOptions = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: querystring.stringify(fetchBody)
        };
        let fetchPromise = fetch(requestURL, requestOptions);
        return Promise.resolve(fetchPromise)
            .then(response => {
            if (response.status && response.status !== 200) {
                let revokeAccesTokenException = {
                    requestURL: requestURL,
                    requestOptions: requestOptions,
                    response: response
                };
                console.error(revokeAccesTokenException);
                throw revokeAccesTokenException;
            }
        })
            .then(response => {
            this.options.accessToken = undefined;
            console.info('Access Token revoked');
            this.emit('accessTokenRevoked');
        });
    }
}
exports.Fetcher = Fetcher;
//# sourceMappingURL=fetcher.js.map