import { FetchSalesforceOptions } from './fetchSalesforceOptions';
export declare class FetchSalesforce {
    options: FetchSalesforceOptions;
    baseDataURL: string;
    accessToken: string;
    constructor(options: FetchSalesforceOptions);
    private initializeBaseDataURL();
    private formatApiVersion();
    refreshAccessToken(): Promise<any>;
    query(soqlQuery: string): Promise<any>;
    private buildAuthorizedHeaders(headers?);
    insert(sobjectName: string, body: any): Promise<any>;
    private getSObjectUrl(sobjectName);
    update(sobjectName: string, body: any): Promise<any>;
}
