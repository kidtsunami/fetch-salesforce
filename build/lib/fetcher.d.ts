/// <reference types="bluebird" />
import { SalesforceOptions } from './salesforceOptions';
import { RequestOptions } from './requestOptions';
import Promise = require('bluebird');
export declare class Fetcher {
    options: SalesforceOptions;
    isRefreshingAccessToken: boolean;
    private pendingRequests;
    private accessToken;
    constructor(options: SalesforceOptions);
    getAccessToken(): Promise<string>;
    private refreshAccessToken();
    fetchJSON(requestURL: string, requestOptions: RequestOptions): Promise<any>;
    private addAuthorizationHeaders(headers?);
    private isInvalidSession(response);
    private refreshAccessTokenAndRetryPendingRequests(fetcherRequest);
    private retryPendingRequests();
    private handleGenericErrors(requestURL, requestOptions, response);
}
