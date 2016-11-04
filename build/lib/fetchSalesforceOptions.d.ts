export interface FetchSalesforceOptions {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    apiVersion?: number;
}
export declare function withDefaultFetchSalesforceOptions(options: FetchSalesforceOptions): FetchSalesforceOptions;
