import { Fetcher } from './fetcher';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchChatter {
    fetcher: Fetcher;
    baseChatterURL: string;
    options: SalesforceOptions;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private initializeBaseChatterURL();
    list(): Promise<any>;
    post(post: any): Promise<any>;
}
