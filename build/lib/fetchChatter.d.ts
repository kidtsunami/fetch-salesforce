/// <reference types="bluebird" />
import { Fetcher } from './fetcher';
import Promise = require('bluebird');
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchChatter {
    fetcher: Fetcher;
    options: SalesforceOptions;
    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchChatter;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private getBaseChatterURL();
    list(): Promise<any>;
    private confirmCommunityID();
    post(post: any): Promise<any>;
}
