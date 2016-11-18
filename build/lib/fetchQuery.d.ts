/// <reference types="bluebird" />
import { Fetcher } from './fetcher';
import Promise = require('bluebird');
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchQuery {
    fetcher: Fetcher;
    options: SalesforceOptions;
    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchQuery;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private getBaseDataURL();
    query(soqlQuery: string): Promise<any>;
}
