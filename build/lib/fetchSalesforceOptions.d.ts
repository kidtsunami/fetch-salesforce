export interface FetchSalesforceOptions {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    apiVersion?: string;
}
export declare function withDefaultFetchSalesforceOptions(options: FetchSalesforceOptions): FetchSalesforceOptions;
