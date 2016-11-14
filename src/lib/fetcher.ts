import { SalesforceOptions } from './salesforceOptions'
import { RequestOptions } from './requestOptions';

import * as querystring from 'querystring';
import events = require('events');

import Promise = require('bluebird');
let fetch = require('node-fetch');
fetch.Promise = Promise;

interface FetcherRequest {
    requestURL: string,
    requestOptions: RequestOptions,
    resolve: (thenableOrResult?: {} | Promise.Thenable<{}>) => void,
    reject: (thenableOrResult?: {} | Promise.Thenable<{}>) => void
}

export class Fetcher extends events.EventEmitter {
    options: SalesforceOptions;
    isRefreshingAccessToken: boolean;
    
    private pendingRequests: FetcherRequest[];
    private accessToken: string;

    constructor(options: SalesforceOptions){
        super();
        this.options = options;
        this.accessToken = undefined;
        this.isRefreshingAccessToken = false;
        this.pendingRequests = [];
    }

    getAccessToken(): Promise<string> {
        if(this.accessToken){
            return Promise.resolve(this.accessToken);
        } else {
            return this.refreshAccessToken();
        }
    }
    
    private refreshAccessToken(): Promise<string> {
        this.emit('accessTokenRefreshing');
        let requestURL = this.options.tokenServiceURL;
        let accessToken: string;

        let fetchBody = {
            grant_type: 'refresh_token',
            refresh_token: this.options.refreshToken,
            client_id: this.options.clientID,
            format: 'json'
        };

        let requestOptions = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            cache: false,
            body: querystring.stringify(fetchBody)
        };
        return fetch(requestURL, requestOptions)
            .then(response => response.json())
            .then(response => this.handleGenericErrors(requestURL, requestOptions, response))
            .then((response) => {
                console.info(`New accessToken retrieved`);
                this.emit('accessTokenRefreshed');
                this.accessToken = response.access_token;
                return response;
            });
    }

    fetchJSON(requestURL: string, requestOptions: RequestOptions): Promise<any>{
        return new Promise((resolve, reject) => {
            this.addAuthorizationHeaders(requestOptions.headers)
                .then(headers => {
                    requestOptions.headers = headers;
                    let fetcherRequest: FetcherRequest = {
                        requestURL: requestURL,
                        requestOptions: requestOptions,
                        resolve: resolve, 
                        reject: reject
                    };
                    console.info('Fetching JSON');
                    console.info(fetcherRequest);
                    fetch(requestURL, requestOptions)
                        .then(response => response.json())
                        .then(response => {
                            if(this.isInvalidSession(response)){
                                console.info(`${ this.accessToken } is invalid, refreshing!`);
                                this.pendingRequests.push(fetcherRequest);
                                this.refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
                            } else {
                                resolve(this.handleGenericErrors(requestURL, requestOptions, response));
                            }
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
                    'Authorization': 'Authorization: Bearer ' + this.accessToken
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
            this.refreshAccessToken()
                .bind(this)
                .then(() => {
                    return this.retryPendingRequests()
                });
        } else {
            console.info('Already refreshing token');
        }
    }

    private retryPendingRequests(){
        let retryPromises: Promise<any>[] = [];
        console.info(`Attempting to retry ${ this.pendingRequests.length } pendingRequests`);
        console.info(`Access token is now ${ this.accessToken }`);
        for(let pendingRequest of this.pendingRequests){
            retryPromises.push(this.fetchJSON(pendingRequest.requestURL, pendingRequest.requestOptions));
        }
        console.log('Promising all');
        Promise.all(retryPromises)
            .then(responses => {
                for(let requestIndex in responses){
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
                throw(error);
            });;
    }

    private handleGenericErrors(requestURL: string, requestOptions: RequestOptions, response: any): any{
        if(!response || response.error){
            let fetchJSONException = {
                requestURL: requestURL,
                requestOptions: requestOptions,
                response: response
            }
            console.error(fetchJSONException);
            throw fetchJSONException;
        } else {
            return response;
        }
    }
}