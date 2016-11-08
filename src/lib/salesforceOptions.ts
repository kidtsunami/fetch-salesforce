var numeral = require('numeral');

export interface SalesforceOptions {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    apiVersion?: number; 
}

let defaultOptions = {
    apiVersion: 33
}

export function withDefaults(options: SalesforceOptions): SalesforceOptions {
    return Object.assign(defaultOptions, options);
}

export function formatApiVersion(apiVersion: number){
    return 'v' + numeral(apiVersion).format('0.0');
}