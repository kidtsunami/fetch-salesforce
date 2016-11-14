import { Fetcher } from './fetcher';
import { FetchSObject } from './fetchSObject';
import { FetchQuery } from './fetchQuery';
import { FetchChatter } from './fetchChatter';
import { FetchApexREST } from './fetchApexREST';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchSalesforce {
    options: SalesforceOptions;
    fetcher: Fetcher;
    fetchSObject: FetchSObject;
    fetchQuery: FetchQuery;
    fetchChatter: FetchChatter;
    fetchApexREST: FetchApexREST;
    constructor(options: SalesforceOptions);
}
