export interface FetchSalesforceOptions {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    apiVersion?: number; 
}

let defaultOptions = {
    apiVersion: 33
}

export function withDefaultFetchSalesforceOptions(options: FetchSalesforceOptions): FetchSalesforceOptions {
    return Object.assign(defaultOptions, options);
}