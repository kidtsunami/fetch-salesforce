"use strict";
let urlJoin = require('url-join');
const salesforceOptions_1 = require('./salesforceOptions');
const querystring = require('querystring');
class FetchQuery {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseDataURL();
    }
    static Create(fetcher, options) {
        return new FetchQuery(fetcher, options);
    }
    initializeBaseDataURL() {
        let apiVersion = salesforceOptions_1.formatApiVersion(this.options.apiVersion);
        this.baseDataURL = urlJoin(this.options.baseURL, 'services/data', apiVersion);
    }
    query(soqlQuery) {
        let encodedQuery = '?' + querystring.stringify({ q: soqlQuery });
        let fetchUrl = urlJoin(this.baseDataURL, 'query', encodedQuery);
        let fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
exports.FetchQuery = FetchQuery;
//# sourceMappingURL=fetchQuery.js.map