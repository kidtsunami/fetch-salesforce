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
    retrieve(resource: string): Promise<any>;
    create(resource: string, body: any): Promise<any>;
    update(resource: string, body: any): Promise<any>;
    delete(resource: string): Promise<any>;
    private confirmCommunityID();
}
