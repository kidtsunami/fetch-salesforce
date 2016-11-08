export interface SalesforceOptions {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    apiVersion?: number;
}
export declare function withDefaults(options: SalesforceOptions): SalesforceOptions;
export declare function formatApiVersion(apiVersion: number): string;
