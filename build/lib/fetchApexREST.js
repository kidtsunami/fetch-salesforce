"use strict";
let urlJoin = require('url-join');
class FetchApexREST {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
    }
    static Create(fetcher, options) {
        return new FetchApexREST(fetcher, options);
    }
    getBaseApexRESTURL() {
        return urlJoin(this.options.instanceURL, 'apexrest');
    }
    get(endpointPath) {
        let fetchUrl = urlJoin(this.getEndpointURL(endpointPath));
        let fetchOptions = {
            method: 'GET'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    getEndpointURL(endpointPath) {
        return urlJoin(this.getBaseApexRESTURL(), endpointPath);
    }
    post(endpointPath, body) {
        let fetchUrl = this.getEndpointURL(endpointPath);
        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    patch(endpointPath, body) {
        let bodyJSON = JSON.stringify(body);
        let fetchUrl = this.getEndpointURL(endpointPath);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    delete(endpointPath) {
        let fetchUrl = this.getEndpointURL(endpointPath);
        let fetchOptions = {
            method: 'DELETE'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
exports.FetchApexREST = FetchApexREST;
//# sourceMappingURL=fetchApexREST.js.map