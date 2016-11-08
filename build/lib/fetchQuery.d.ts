import { Fetcher } from './fetcher';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchQuery {
    fetcher: Fetcher;
    baseDataURL: string;
    options: SalesforceOptions;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private initializeBaseDataURL();
    query(soqlQuery: string): Promise<any>;
}
