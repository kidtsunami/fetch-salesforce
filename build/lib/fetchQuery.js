"use strict";
var urlJoin = require('url-join');
var salesforceOptions_1 = require('./salesforceOptions');
var querystring = require('querystring');
var FetchQuery = (function () {
    function FetchQuery(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseDataURL();
    }
    FetchQuery.prototype.initializeBaseDataURL = function () {
        var apiVersion = salesforceOptions_1.formatApiVersion(this.options.apiVersion);
        this.baseDataURL = urlJoin(this.options.baseURL, 'services/data', apiVersion);
    };
    FetchQuery.prototype.query = function (soqlQuery) {
        var encodedQuery = '?' + querystring.stringify({ q: soqlQuery });
        var fetchUrl = urlJoin(this.baseDataURL, 'query', encodedQuery);
        var fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    return FetchQuery;
}());
exports.FetchQuery = FetchQuery;
//# sourceMappingURL=fetchQuery.js.map