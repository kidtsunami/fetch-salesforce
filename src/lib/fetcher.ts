import { SalesforceOptions } from './salesforceOptions'
import { RequestOptions } from './requestOptions';
import FailedToRevokeAccessToken from './errors/failedToRevokeAccessToken';
import { FetchSalesforceRequestError, FetchSalesforceRequestErrorContext } from './errors/unsuccessfulFetchRequest';
import Logger from './logger';
import * as querystring from 'querystring';
import events = require('events');
import urlJoin = require('url-join');

/* tslint:disable */
if (global['fetch'] === undefined) {
    fetch = require('isomorphic-fetch');
}
import Promise = require('bluebird');
/* tslint:enable */

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
    logger: Logger;
    
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
        this.logger = new Logger(this.options.logLevel);
    }

    getAccessToken(): Promise<string> {
        if(this.options.accessToken){
            return Promise.resolve(this.options.accessToken);
        } else {
            this.logger.info('No AccessToken, Refreshing Access Token');
            return this.refreshAccessToken()
                .then((response) => {
                    return this.options.accessToken;
                });
        }
    }
    
    private refreshAccessToken(): Promise<any> {
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
        let fetchResponse: any;
        return Promise.resolve(fetchPromise)
            .then((response: any) => {
                fetchResponse = response;
                return this.parseResponseBody(fetchResponse);
            })
            .then((responseBody: any) => {
                if (this.isErrorResponse(fetchResponse)) {
                    this.throwError(requestURL, requestOptions, fetchResponse, responseBody);
                }
                this.logger.info('fooooooo', responseBody);
                this.options.accessToken = responseBody.access_token;
                this.emit('accessTokenRefreshed', responseBody.access_token);
                return Promise.resolve(responseBody.access_token);
            })
            .catch((err:any) => {
                return Promise.reject(err);
            });
    }

    private getTokenServiceURL(){
        let tokenServiceURL = this.options.tokenServiceURL;
        if(!tokenServiceURL){
            tokenServiceURL = urlJoin(this.options.instanceURL, '/services/oauth2/token');
        }
        return tokenServiceURL;
    }

    fetchJSON(requestURL: string, requestOptions: RequestInit): Promise<any>{
        return new Promise((resolve, reject) => {
            let fetcherRequest: FetcherRequest;
            let fetchResponse: any;
            this.addAuthorizationHeaders(requestOptions.headers)
                .then(headers => {
                    requestOptions.headers = headers;
                    fetcherRequest = {
                        requestURL: requestURL,
                        requestOptions: requestOptions,
                        resolved: false,
                        resolve: resolve, 
                        reject: reject
                    };
                    return fetch(requestURL, requestOptions);
                })
                .then(response => {
                    fetchResponse = response;
                    this.logger.debug('fetchJSON response', fetchResponse);
                    return this.parseResponseBody(fetchResponse);
                })
                .then((responseBody: any) => {
                    if (this.isInvalidSession(fetchResponse)) {
                        this.pendingRequests.push(fetcherRequest);
                        return this.refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
                    }

                    if (this.isErrorResponse(fetchResponse)) {
                        this.throwError(requestURL, requestOptions, fetchResponse, responseBody)
                    }

                    resolve(responseBody);
                })
                .catch((error: Error) => {
                    reject(error);
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

    private isErrorResponse(response: Response): boolean{
        return response.status >= 400;
    }

    private isInvalidSession(response: any): boolean {
        return response.status === 401 || response.status === 403;
    }

    private throwError(requestUrl: string, requestOptions: RequestInit, response: Response, responseBody: any): void{
        if (Array.isArray(responseBody) && responseBody.length > 0) {
            responseBody = responseBody[0];
        }

        if (responseBody.error_description === 'expired access/refresh token') {
            this.emit('tokenExpired', response);
        }

        if (responseBody.error_description === 'inactive user') {
            this.emit('inactiveUser', response);
        }

        const errorContext: FetchSalesforceRequestErrorContext = {
            requestURL: requestUrl,
            requestOptions: requestOptions,
            responseBody: responseBody,
            errorCode: responseBody.error,
            errorDescription: responseBody.error_description,
        }

        this.logger.debug('error', responseBody);

        throw new FetchSalesforceRequestError(responseBody.message, errorContext)
    }

    private parseResponseBody(response: any): Promise<any>{
      return response.text()
        .then((text: string) => {
            if (text === 'Bad_OAuth_Token') {
                return Promise.resolve({
                    error: 'Bad_OAuth_Token'
                });
            } else if (text) {
                return Promise.resolve(JSON.parse(text));
            } else {
                return Promise.resolve({});
            }
        })
        .catch((err: any) => {
          return Promise.reject(err);
        });
    }

    private refreshAccessTokenAndRetryPendingRequests(fetcherRequest: FetcherRequest){
        if(!this.isRefreshingAccessToken){
            this.isRefreshingAccessToken = true;
            this.logger.info('Refreshing token and retrying pending requests');
            return this.refreshAccessToken()
                .then(() => {
                    return this.retryPendingRequests();
                })
                .catch((error) => {
                    this.logger.warn(error);
                    for(let pendingRequest of this.pendingRequests){
                        pendingRequest.reject(error);
                    }
                });
        } else {
            this.logger.info('Already refreshing token');
        }
    }

    private retryPendingRequests(){
        let retryPromises: Promise<any>[] = [];
        this.logger.info(`Attempting to retry ${ this.pendingRequests.length } pendingRequests`);
        for(let pendingRequest of this.pendingRequests){
            retryPromises.push(this.fetchJSON(pendingRequest.requestURL, pendingRequest.requestOptions));
        }
        this.logger.info('retrying all pending requests');
        return Promise.all(retryPromises)
            .then(responses => {
                for(let requestIndex in responses){
                    let response = responses[requestIndex];
                    let pendingRequest = this.pendingRequests[requestIndex];
                    pendingRequest.resolve(response);
                    pendingRequest.resolved = false;
                }
                this.logger.info('PendingRequests have been retried');
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
        let fetchResponse: any;
        return Promise.resolve(fetchPromise)
            .then((response: any) => {  
                fetchResponse = response;
                return this.parseResponseBody(response);
            })
            .then((responseBody: any) => {  
                if (this.isErrorResponse(fetchResponse)) {
                    this.throwError(requestURL, requestOptions, fetchResponse, responseBody);
                }

                this.options.accessToken = undefined;
                this.logger.info('Access Token revoked');
                this.emit('accessTokenRevoked');
                return Promise.resolve();
            })
            .catch((err: any) => {
                return Promise.reject(err);
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