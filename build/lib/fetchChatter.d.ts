import { Fetcher } from './fetcher';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchChatter {
    fetcher: Fetcher;
    baseChatterURL: string;
    options: SalesforceOptions;
    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchChatter;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private initializeBaseChatterURL();
    list(): Promise<any>;
    private confirmCommunityID();
    post(post: any): Promise<any>;
}
