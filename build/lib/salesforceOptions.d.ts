export interface SalesforceOptions {
    baseURL: string;
    clientID: string;
    clientSecret?: string;
    refreshToken: string;
    apiVersion?: number;
    sfdcCommunityID?: string;
    authorizationServiceURL?: string;
    tokenServiceURL?: string;
    revokeServiceURL?: string;
    redirectUri?: string;
}
export declare function withDefaults(options: SalesforceOptions): SalesforceOptions;
export declare function formatApiVersion(apiVersion: number): string;
