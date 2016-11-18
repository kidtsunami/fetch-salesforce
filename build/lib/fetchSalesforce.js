"use strict";
var fetcher_1 = require('./fetcher');
var fetchSObject_1 = require('./fetchSObject');
var fetchQuery_1 = require('./fetchQuery');
var fetchChatter_1 = require('./fetchChatter');
var fetchApexREST_1 = require('./fetchApexREST');
var salesforceOptions_1 = require('./salesforceOptions');
var urlJoin = require('url-join');
var querystring = require('querystring');
var FetchSalesforce = (function () {
    function FetchSalesforce(options) {
        this.options = salesforceOptions_1.withDefaults(options);
        this.fetcher = fetcher_1.Fetcher.Create(this.options);
        this.fetchSObject = fetchSObject_1.FetchSObject.Create(this.fetcher, this.options);
        this.fetchQuery = fetchQuery_1.FetchQuery.Create(this.fetcher, this.options);
        this.fetchChatter = fetchChatter_1.FetchChatter.Create(this.fetcher, this.options);
        this.fetchApexREST = fetchApexREST_1.FetchApexREST.Create(this.fetcher, this.options);
    }
    FetchSalesforce.prototype.buildAuthorizationURL = function (scopeAndState) {
        var parameters = Object.assign({
            response_type: 'code',
            client_id: this.options.clientID,
            redirect_uri: this.options.redirectUri
        }, scopeAndState);
        var encodedQuery = '?' + querystring.stringify(parameters);
        return urlJoin(this.options.authorizationServiceURL, encodedQuery);
    };
    return FetchSalesforce;
}());
exports.FetchSalesforce = FetchSalesforce;
//# sourceMappingURL=fetchSalesforce.js.map