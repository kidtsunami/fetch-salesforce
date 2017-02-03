import { SalesforceOptions } from './salesforceOptions'
import { RequestOptions } from './requestOptions';
import FailedToRevokeAccessToken from './errors/failedToRevokeAccessToken';
import UnsuccessfulFetchRequest from './errors/unsuccessfulFetchRequest';

import * as querystring from 'querystring';
import events = require('events');
import urlJoin = require('url-join');

if (global['fetch'] === undefined) {
    fetch = require('isomorphic-fetch');
}
import Promise = require('bluebird');

interface FetcherRequest {
    requestURL: string,
    requestOptions: RequestInit,
    resolved: boolean,
    resolve: (thenableOrResult?: {} | Promise.Thenable<{}>) => void,
    reject: (thenableOrResult?: {} | Promise.Thenable<{}>) => void
}

interface RefreshAccessTokenBody {
    grant_type: string,
    refresh_token: string,
    client_id: string,
    format: string,
    client_secret?: string
}

export class Fetcher extends events.EventEmitter {
    options: SalesforceOptions;
    isRefreshingAccessToken: boolean;
    
    private pendingRequests: FetcherRequest[];

    static Create(options: SalesforceOptions){
        return new Fetcher(options);
    }

    constructor(options: SalesforceOptions){
        super();
        this.options = options;
        this.options.accessToken = undefined;
        this.isRefreshingAccessToken = false;
        this.pendingRequests = [];
    }

    getAccessToken(): Promise<string> {
        if(this.options.accessToken){
            return Promise.resolve(this.options.accessToken);
        } else {
            console.info('No AccessToken, Refreshing Access Token');
            return this.refreshAccessToken()
                .then((response) => {
                    return this.options.accessToken;
                });
        }
    }
    
    private refreshAccessToken(): Promise<string> {
        this.emit('accessTokenRefreshing');
        let requestURL = this.getTokenServiceURL();
        let accessToken: string;

        let fetchBody: RefreshAccessTokenBody = {
            grant_type: 'refresh_token',
            refresh_token: this.options.refreshToken,
            client_id: this.options.clientID,
            format: 'json'
        };

        if(this.options.clientSecret){
            fetchBody.client_secret = this.options.clientSecret;
        }

        let requestOptions: RequestInit = {
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
                this.options.accessToken = response.access_token;
                this.emit('accessTokenRefreshed', response.access_token);
                return response;
            });
    }

    private getTokenServiceURL(){
        let tokenServiceURL = this.options.tokenServiceURL;
        if(!tokenServiceURL){
            tokenServiceURL = urlJoin(this.options.instanceURL, '/services/oauth2/token');
        }
        return tokenServiceURL;
    }

    private handleGenericErrors(requestURL: string, requestOptions: RequestInit, response: any): any{
        if(!response || response.error){
            let fetchJSONException = new UnsuccessfulFetchRequest(
                'fetchJSON received a response error',
                requestURL,
                requestOptions,
                response
            );
            console.warn(fetchJSONException);
            throw fetchJSONException;
        } else {
            return response;
        }
    }

    fetchJSON(requestURL: string, requestOptions: RequestInit): Promise<any>{
        return new Promise((resolve, reject) => {
            this.addAuthorizationHeaders(requestOptions.headers)
                .then(headers => {
                    requestOptions.headers = headers;
                    let fetcherRequest: FetcherRequest = {
                        requestURL: requestURL,
                        requestOptions: requestOptions,
                        resolved: false,
                        resolve: resolve, 
                        reject: reject
                    };
                    let fetchPromise = fetch(requestURL, requestOptions);

                    return Promise.resolve(fetchPromise)
                        .then(response => {
                            if(response.status !== 204){
                                return response.json()
                            } else {
                                return response;
                            }
                        })
                        .then(response => {
                            if(this.isInvalidSession(response)){
                                console.info(`${ this.options.accessToken } is invalid, refreshing!`);
                                this.pendingRequests.push(fetcherRequest);
                                return this.refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
                            } else {
                                resolve(this.handleGenericErrors(requestURL, requestOptions, response));
                            }
                        })
                        .catch((error) => {
                            console.warn('fetchJSON:\n\tWith:\n\t\trequestURL: ', requestURL, 
                                '\n\t\trequestOptions: ', requestOptions,
                                '\n\n\tHad Error: ', error);
                            return Promise.reject(error);
                        });
                });

        });
    }
    
    private addAuthorizationHeaders(headers?: any): any {
        return this.getAccessToken()
            .then((accessTokenResponse) => {
                if(headers === undefined){
                    headers = {};
                }
                let authorizedHeader = {
                    'Authorization': 'Authorization: Bearer ' + this.options.accessToken
                }
                return Object.assign(headers, authorizedHeader);
            });
    }

    private isInvalidSession(response: any): boolean{
        return Array.isArray(response) 
            && response.length > 0 
            && response[0].errorCode === 'INVALID_SESSION_ID'; 
    }

    private refreshAccessTokenAndRetryPendingRequests(fetcherRequest: FetcherRequest){
        if(!this.isRefreshingAccessToken){
            this.isRefreshingAccessToken = true;
            console.info('Refreshing token and retrying pending requests');
            return this.refreshAccessToken()
                .then(() => {
                    return this.retryPendingRequests()
                })
                .catch((error) => {
                    console.warn(error);
                    for(let pendingRequest of this.pendingRequests){
                        pendingRequest.reject(error);
                    }
                });
        } else {
            console.info('Already refreshing token');
        }
    }

    private retryPendingRequests(){
        let retryPromises: Promise<any>[] = [];
        console.info(`Attempting to retry ${ this.pendingRequests.length } pendingRequests`);
        for(let pendingRequest of this.pendingRequests){
            retryPromises.push(this.fetchJSON(pendingRequest.requestURL, pendingRequest.requestOptions));
        }
        console.log('Promising all');
        return Promise.all(retryPromises)
            .then(responses => {
                for(let requestIndex in responses){
                    let response = responses[requestIndex];
                    let pendingRequest = this.pendingRequests[requestIndex];
                    console.log('Resolving!!!!');
                    pendingRequest.resolve(response);
                    pendingRequest.resolved = false;
                }
                console.info('PendingRequests have been retried');
            });
    }

    revokeAccessToken(): Promise<any> {
        if(!this.options.accessToken){
            throw new FailedToRevokeAccessToken('No Access Token to Revoke', this.options.accessToken);
        }

        this.emit('accessTokenRevoking');
        let requestURL = this.getRevokeServiceURL();

        let fetchBody = {
            token: this.options.accessToken
        };

        let requestOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: querystring.stringify(fetchBody)
        };

        let fetchPromise = fetch(requestURL, requestOptions); 
        return Promise.resolve(fetchPromise)
            .then(response => {
                if(response.status && response.status !== 200){
                    let revokeAccesTokenException = new UnsuccessfulFetchRequest(
                        'revokeAccessToken received a response error',
                        requestURL,
                        requestOptions,
                        response
                    );
                    console.warn(revokeAccesTokenException);
                    throw revokeAccesTokenException;
                }
            })
            .then(response => {
                this.options.accessToken = undefined;
                console.info('Access Token revoked');
                this.emit('accessTokenRevoked');
            });
    }

    private getRevokeServiceURL(){
        let revokeServiceURL = this.options.revokeServiceURL;
        if(!revokeServiceURL){
            revokeServiceURL = urlJoin(this.options.instanceURL, '/services/oauth2/revoke');
        }
        return revokeServiceURL;
    }
}