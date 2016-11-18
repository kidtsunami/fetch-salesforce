var numeral = require('numeral');
let urlJoin = require('url-join');

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

let defaultOptions = {
    apiVersion: 33
}

export function withDefaults(options: SalesforceOptions): SalesforceOptions {
    let defaultOptionsByBaseURL: any = Object.assign({}, defaultOptions);
    defaultOptionsByBaseURL.authorizationServiceURL = urlJoin(options.baseURL, '/services/oauth2/authorize');
    defaultOptionsByBaseURL.tokenServiceURL = urlJoin(options.baseURL, '/services/oauth2/token');
    defaultOptionsByBaseURL.revokeServiceURL = urlJoin(options.baseURL, '/services/oauth2/revoke');
    
    return Object.assign(defaultOptionsByBaseURL, options);
}

export function formatApiVersion(apiVersion: number){
    return 'v' + numeral(apiVersion).format('0.0');
}