
import { Fetcher } from './fetcher';
import { FetchSObject } from './fetchSObject';
import { FetchQuery } from './fetchQuery';
import { FetchChatter } from './fetchChatter';
import { FetchApexREST } from './fetchApexREST';
import { SalesforceOptions, withDefaults } from './salesforceOptions'

let urlJoin = require('url-join');
import * as querystring from 'querystring';

export interface ScopeAndState {
    scope?: string,
    state?: string
}

export class FetchSalesforce {
    options: SalesforceOptions;
    fetcher: Fetcher;
    fetchSObject: FetchSObject;
    fetchQuery: FetchQuery;
    fetchChatter: FetchChatter;
    fetchApexREST: FetchApexREST;

    constructor(options: SalesforceOptions){
        this.options = withDefaults(options);
        this.fetcher = new Fetcher(this.options);
        this.fetchSObject = new FetchSObject(this.fetcher, this.options);
        this.fetchQuery = new FetchQuery(this.fetcher, this.options);
        this.fetchChatter = new FetchChatter(this.fetcher, this.options);
        this.fetchApexREST = new FetchApexREST(this.fetcher, this.options);
    }

    buildAuthorizationURL(scopeAndState: ScopeAndState): string {
        let parameters = Object.assign({
            response_type: 'code',
            client_id: this.options.clientID,
            redirect_uri: this.options.redirectUri
        }, scopeAndState);
        let encodedQuery = '?' + querystring.stringify(parameters);

        return urlJoin(this.options.authorizationServiceURL, encodedQuery);
    }
}