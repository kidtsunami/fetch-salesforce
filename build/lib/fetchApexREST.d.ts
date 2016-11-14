import { Fetcher } from './fetcher';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchApexREST {
    fetcher: Fetcher;
    baseApexRESTURL: string;
    options: SalesforceOptions;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private initializeBaseApexRESTURL();
    get(endpointPath: string): Promise<any>;
    private getEndpointURL(endpointPath);
    post(endpointPath: string, body: any): Promise<any>;
    patch(endpointPath: string, body: any): Promise<any>;
    delete(endpointPath: string): Promise<any>;
}
