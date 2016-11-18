
import { Fetcher } from './fetcher';
import { FetchSObject } from './fetchSObject';
import { FetchQuery } from './fetchQuery';
import { FetchChatter } from './fetchChatter';
import { FetchApexREST } from './fetchApexREST';
import { FetchUserInfo } from './fetchUserInfo';
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
    fetchUserInfo: FetchUserInfo;

    constructor(options: SalesforceOptions){
        this.options = withDefaults(options);
        this.fetcher = Fetcher.Create(this.options);
        this.fetchSObject = FetchSObject.Create(this.fetcher, this.options);
        this.fetchQuery = FetchQuery.Create(this.fetcher, this.options);
        this.fetchChatter = FetchChatter.Create(this.fetcher, this.options);
        this.fetchApexREST = FetchApexREST.Create(this.fetcher, this.options);
        this.fetchUserInfo = FetchUserInfo.Create(this.fetcher, this.options);
    }

    buildAuthorizationURL(scopeAndState: ScopeAndState): string {
        let parameters = Object.assign({
            response_type: this.options.authorizationResponseType,
            client_id: this.options.clientID,
            redirect_uri: this.options.redirectUri
        }, scopeAndState);
        let encodedQuery = '?' + querystring.stringify(parameters);

        return urlJoin(this.options.authorizationServiceURL, encodedQuery);
    }
}