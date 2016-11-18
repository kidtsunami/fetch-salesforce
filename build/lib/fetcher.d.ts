/// <reference types="node" />
import { SalesforceOptions } from './salesforceOptions';
import { RequestOptions } from './requestOptions';
import * as events from 'events';
import * as Promise from 'bluebird';
export declare class Fetcher extends events.EventEmitter {
    options: SalesforceOptions;
    isRefreshingAccessToken: boolean;
    private pendingRequests;
    private accessToken;
    static Create(options: SalesforceOptions): Fetcher;
    constructor(options: SalesforceOptions);
    getAccessToken(): Promise<string>;
    private refreshAccessToken();
    fetchJSON(requestURL: string, requestOptions: RequestOptions): Promise<any>;
    private addAuthorizationHeaders(headers?);
    private isInvalidSession(response);
    private refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
    private retryPendingRequests();
    private handleGenericErrors(requestURL, requestOptions, response);
    revokeAccessToken(): Promise<any>;
}
