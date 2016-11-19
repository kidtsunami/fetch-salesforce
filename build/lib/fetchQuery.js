"use strict";
let urlJoin = require('url-join');
const salesforceOptions_1 = require('./salesforceOptions');
const querystring = require('querystring');
class FetchQuery {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
    }
    static Create(fetcher, options) {
        return new FetchQuery(fetcher, options);
    }
    getBaseDataURL() {
        let apiVersion = salesforceOptions_1.formatApiVersion(this.options.apiVersion);
        return urlJoin(this.options.instanceURL, 'services/data', apiVersion);
    }
    query(soqlQuery) {
        let encodedQuery = '?' + querystring.stringify({ q: soqlQuery });
        let fetchUrl = urlJoin(this.getBaseDataURL(), 'query', encodedQuery);
        let fetchOptions = {
            method: 'GET',
            cache: 'no-cache'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
exports.FetchQuery = FetchQuery;
//# sourceMappingURL=fetchQuery.js.map