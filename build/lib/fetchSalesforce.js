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
        this.fetcher = new fetcher_1.Fetcher(this.options);
        this.fetchSObject = new fetchSObject_1.FetchSObject(this.fetcher, this.options);
        this.fetchQuery = new fetchQuery_1.FetchQuery(this.fetcher, this.options);
        this.fetchChatter = new fetchChatter_1.FetchChatter(this.fetcher, this.options);
        this.fetchApexREST = new fetchApexREST_1.FetchApexREST(this.fetcher, this.options);
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