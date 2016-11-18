var numeral = require('numeral');
let urlJoin = require('url-join');

export interface SalesforceOptions {
    instanceURL: string;
    clientID: string;
    clientSecret?: string;
    refreshToken: string;
    accessToken?: string;
    apiVersion?: number;
    sfdcCommunityID?: string;
    authorizationServiceURL?: string;
    authorizationResponseType?: string;
    tokenServiceURL?: string;
    revokeServiceURL?: string;
    redirectUri?: string;
}

let defaultOptions = {
    apiVersion: 33,
    authorizationResponseType: 'token'
}

export function withDefaults(options: SalesforceOptions): SalesforceOptions {
    let defaultOptionsByinstanceURL: any = Object.assign({}, defaultOptions);
    defaultOptionsByinstanceURL.authorizationServiceURL = urlJoin(options.instanceURL, '/services/oauth2/authorize');
    defaultOptionsByinstanceURL.tokenServiceURL = urlJoin(options.instanceURL, '/services/oauth2/token');
    defaultOptionsByinstanceURL.revokeServiceURL = urlJoin(options.instanceURL, '/services/oauth2/revoke');
    
    return Object.assign(defaultOptionsByinstanceURL, options);
}

export function formatApiVersion(apiVersion: number){
    return 'v' + numeral(apiVersion).format('0.0');
}