/// <reference types="node" />
/// <reference types="bluebird" />
import { SalesforceOptions } from './salesforceOptions';
import { RequestOptions } from './requestOptions';
import events = require('events');
import Promise = require('bluebird');
export declare class Fetcher extends events.EventEmitter {
    options: SalesforceOptions;
    isRefreshingAccessToken: boolean;
    private pendingRequests;
    static Create(options: SalesforceOptions): Fetcher;
    constructor(options: SalesforceOptions);
    getAccessToken(): Promise<string>;
    private refreshAccessToken();
    private getTokenServiceURL();
    fetchJSON(requestURL: string, requestOptions: RequestOptions): Promise<any>;
    private addAuthorizationHeaders(headers?);
    private isInvalidSession(response);
    private refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
    private retryPendingRequests();
    private handleGenericErrors(requestURL, requestOptions, response);
    revokeAccessToken(): Promise<any>;
    private getRevokeServiceURL();
}
