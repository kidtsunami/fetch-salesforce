/// <reference types="bluebird" />
import { Fetcher } from './fetcher';
import Promise = require('bluebird');
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchUserInfo {
    fetcher: Fetcher;
    baseUserInfoURL: string;
    options: SalesforceOptions;
    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchUserInfo;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private initializeBaseUserInfoURL();
    get(): Promise<any>;
}
