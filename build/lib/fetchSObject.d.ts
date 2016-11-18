/// <reference types="bluebird" />
import { Fetcher } from './fetcher';
import Promise = require('bluebird');
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchSObject {
    fetcher: Fetcher;
    options: SalesforceOptions;
    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchSObject;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private getBaseDataURL();
    insert(sobjectName: string, body: any): Promise<any>;
    private getSObjectUrl(sobjectName);
    get(sobjectName: string, id: string): Promise<any>;
    update(sobjectName: string, body: any): Promise<any>;
    delete(sobjectName: string, id: string): Promise<any>;
}
