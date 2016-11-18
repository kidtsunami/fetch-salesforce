"use strict";
const fetcher_1 = require('./fetcher');
const fetchSObject_1 = require('./fetchSObject');
const fetchQuery_1 = require('./fetchQuery');
const fetchChatter_1 = require('./fetchChatter');
const fetchApexREST_1 = require('./fetchApexREST');
const salesforceOptions_1 = require('./salesforceOptions');
let urlJoin = require('url-join');
const querystring = require('querystring');
class FetchSalesforce {
    constructor(options) {
        this.options = salesforceOptions_1.withDefaults(options);
        this.fetcher = fetcher_1.Fetcher.Create(this.options);
        this.fetchSObject = fetchSObject_1.FetchSObject.Create(this.fetcher, this.options);
        this.fetchQuery = fetchQuery_1.FetchQuery.Create(this.fetcher, this.options);
        this.fetchChatter = fetchChatter_1.FetchChatter.Create(this.fetcher, this.options);
        this.fetchApexREST = fetchApexREST_1.FetchApexREST.Create(this.fetcher, this.options);
    }
    buildAuthorizationURL(scopeAndState) {
        let parameters = Object.assign({
            response_type: this.options.authorizationResponseType,
            client_id: this.options.clientID,
            redirect_uri: this.options.redirectUri
        }, scopeAndState);
        let encodedQuery = '?' + querystring.stringify(parameters);
        return urlJoin(this.options.authorizationServiceURL, encodedQuery);
    }
}
exports.FetchSalesforce = FetchSalesforce;
//# sourceMappingURL=fetchSalesforce.js.map