export interface FetchSalesforceOptions {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    apiVersion?: string; 
}

let defaultOptions = {
    apiVersion: 'v33.0'
}

export function withDefaultFetchSalesforceOptions(options: FetchSalesforceOptions): FetchSalesforceOptions {
    return Object.assign(defaultOptions, options);
}