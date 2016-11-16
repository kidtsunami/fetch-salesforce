"use strict";
var urlJoin = require('url-join');
var FetchApexREST = (function () {
    function FetchApexREST(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseApexRESTURL();
    }
    FetchApexREST.Create = function (fetcher, options) {
        return new FetchApexREST(fetcher, options);
    };
    FetchApexREST.prototype.initializeBaseApexRESTURL = function () {
        this.baseApexRESTURL = urlJoin(this.options.baseURL, 'apexrest');
    };
    FetchApexREST.prototype.get = function (endpointPath) {
        var fetchUrl = urlJoin(this.getEndpointURL(endpointPath));
        var fetchOptions = {
            method: 'GET'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchApexREST.prototype.getEndpointURL = function (endpointPath) {
        return urlJoin(this.baseApexRESTURL, endpointPath);
    };
    FetchApexREST.prototype.post = function (endpointPath, body) {
        var fetchUrl = this.getEndpointURL(endpointPath);
        var bodyJSON = JSON.stringify(body);
        var fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchApexREST.prototype.patch = function (endpointPath, body) {
        var bodyJSON = JSON.stringify(body);
        var fetchUrl = urlJoin(this.getEndpointURL(endpointPath), body.id);
        var fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchApexREST.prototype.delete = function (endpointPath) {
        var fetchUrl = urlJoin(this.getEndpointURL(endpointPath));
        var fetchOptions = {
            method: 'DELETE'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    return FetchApexREST;
}());
exports.FetchApexREST = FetchApexREST;
//# sourceMappingURL=fetchApexREST.js.map