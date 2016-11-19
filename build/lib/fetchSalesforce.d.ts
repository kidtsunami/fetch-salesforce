import { Fetcher } from './fetcher';
import { FetchSObject } from './fetchSObject';
import { FetchQuery } from './fetchQuery';
import { FetchChatter } from './fetchChatter';
import { FetchApexREST } from './fetchApexREST';
import { FetchUserInfo } from './fetchUserInfo';
import { SalesforceOptions } from './salesforceOptions';
export interface ScopeAndState {
    scope?: string;
    state?: string;
}
export declare class FetchSalesforce {
    options: SalesforceOptions;
    fetcher: Fetcher;
    fetchSObject: FetchSObject;
    fetchQuery: FetchQuery;
    fetchChatter: FetchChatter;
    fetchApexREST: FetchApexREST;
    fetchUserInfo: FetchUserInfo;
    constructor(options: SalesforceOptions);
    buildAuthorizationURL(scopeAndState: ScopeAndState): string;
    private getAuthorizationServiceURL();
}
