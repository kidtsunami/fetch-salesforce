import { Fetcher } from './fetcher';
import { FetchSObject } from './fetchSObject';
import { FetchQuery } from './fetchQuery';
import { FetchChatter } from './fetchChatter';
import { FetchApexREST } from './fetchApexREST';
import { withDefaults } from './salesforceOptions';
import * as urlJoin from 'url-join';
import * as querystring from 'querystring';
export class FetchSalesforce {
    constructor(options) {
        this.options = withDefaults(options);
        this.fetcher = Fetcher.Create(this.options);
        this.fetchSObject = FetchSObject.Create(this.fetcher, this.options);
        this.fetchQuery = FetchQuery.Create(this.fetcher, this.options);
        this.fetchChatter = FetchChatter.Create(this.fetcher, this.options);
        this.fetchApexREST = FetchApexREST.Create(this.fetcher, this.options);
    }
    buildAuthorizationURL(scopeAndState) {
        let parameters = Object.assign({
            response_type: 'code',
            client_id: this.options.clientID,
            redirect_uri: this.options.redirectUri
        }, scopeAndState);
        let encodedQuery = '?' + querystring.stringify(parameters);
        return urlJoin(this.options.authorizationServiceURL, encodedQuery);
    }
}
//# sourceMappingURL=fetchSalesforce.js.map