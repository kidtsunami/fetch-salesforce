"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var querystring = require('querystring');
var events = require('events');
var Promise = require('bluebird');
var fetch = require('node-fetch');
fetch.Promise = Promise;
var Fetcher = (function (_super) {
    __extends(Fetcher, _super);
    function Fetcher(options) {
        _super.call(this);
        this.options = options;
        this.accessToken = undefined;
        this.isRefreshingAccessToken = false;
        this.pendingRequests = [];
    }
    Fetcher.prototype.getAccessToken = function () {
        if (this.accessToken) {
            return Promise.resolve(this.accessToken);
        }
        else {
            return this.refreshAccessToken();
        }
    };
    Fetcher.prototype.refreshAccessToken = function () {
        var _this = this;
        this.emit('accessTokenRefreshing');
        var requestURL = this.options.tokenServiceURL;
        var accessToken;
        var fetchBody = {
            grant_type: 'refresh_token',
            refresh_token: this.options.refreshToken,
            client_id: this.options.clientID,
            format: 'json'
        };
        var requestOptions = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            cache: false,
            body: querystring.stringify(fetchBody)
        };
        return fetch(requestURL, requestOptions)
            .then(function (response) { return response.json(); })
            .then(function (response) { return _this.handleGenericErrors(requestURL, requestOptions, response); })
            .then(function (response) {
            console.info("New accessToken retrieved");
            _this.emit('accessTokenRefreshed');
            _this.accessToken = response.access_token;
            return response;
        });
    };
    Fetcher.prototype.fetchJSON = function (requestURL, requestOptions) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.addAuthorizationHeaders(requestOptions.headers)
                .then(function (headers) {
                requestOptions.headers = headers;
                var fetcherRequest = {
                    requestURL: requestURL,
                    requestOptions: requestOptions,
                    resolve: resolve,
                    reject: reject
                };
                console.info('Fetching JSON');
                console.info(fetcherRequest);
                fetch(requestURL, requestOptions)
                    .then(function (response) { return response.json(); })
                    .then(function (response) {
                    if (_this.isInvalidSession(response)) {
                        console.info(_this.accessToken + " is invalid, refreshing!");
                        _this.pendingRequests.push(fetcherRequest);
                        _this.refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
                    }
                    else {
                        resolve(_this.handleGenericErrors(requestURL, requestOptions, response));
                    }
                });
            });
        });
    };
    Fetcher.prototype.addAuthorizationHeaders = function (headers) {
        var _this = this;
        return this.getAccessToken()
            .then(function (accessTokenResponse) {
            if (headers === undefined) {
                headers = {};
            }
            var authorizedHeader = {
                'Authorization': 'Authorization: Bearer ' + _this.accessToken
            };
            return Object.assign(headers, authorizedHeader);
        });
    };
    Fetcher.prototype.isInvalidSession = function (response) {
        return Array.isArray(response)
            && response.length > 0
            && response[0].errorCode === 'INVALID_SESSION_ID';
    };
    Fetcher.prototype.refreshAccessTokenAndRetryPendingRequests = function (fetcherRequest) {
        var _this = this;
        if (!this.isRefreshingAccessToken) {
            this.isRefreshingAccessToken = true;
            console.info('Refreshing token and retrying pending requests');
            this.refreshAccessToken()
                .bind(this)
                .then(function () {
                return _this.retryPendingRequests();
            });
        }
        else {
            console.info('Already refreshing token');
        }
    };
    Fetcher.prototype.retryPendingRequests = function () {
        var _this = this;
        var retryPromises = [];
        console.info("Attempting to retry " + this.pendingRequests.length + " pendingRequests");
        console.info("Access token is now " + this.accessToken);
        for (var _i = 0, _a = this.pendingRequests; _i < _a.length; _i++) {
            var pendingRequest = _a[_i];
            retryPromises.push(this.fetchJSON(pendingRequest.requestURL, pendingRequest.requestOptions));
        }
        console.log('Promising all');
        Promise.all(retryPromises)
            .then(function (responses) {
            for (var requestIndex in responses) {
                var response = responses[requestIndex];
                var pendingRequest = _this.pendingRequests[requestIndex];
                console.log('Resolving!!!!');
                pendingRequest.resolve(response);
            }
            console.info('PendingRequests have been retried, cleaning pendingRequests');
            _this.pendingRequests = [];
        })
            .catch(function (error) {
            console.error("Failed to retry the pending requests");
            console.error(error);
            throw (error);
        });
        ;
    };
    Fetcher.prototype.handleGenericErrors = function (requestURL, requestOptions, response) {
        if (!response || response.error) {
            var fetchJSONException = {
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
    };
    return Fetcher;
}(events.EventEmitter));
exports.Fetcher = Fetcher;
//# sourceMappingURL=fetcher.js.map