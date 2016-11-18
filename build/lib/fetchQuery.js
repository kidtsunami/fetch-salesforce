import * as urlJoin from 'url-join';
import { formatApiVersion } from './salesforceOptions';
import * as querystring from 'querystring';
export class FetchQuery {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseDataURL();
    }
    static Create(fetcher, options) {
        return new FetchQuery(fetcher, options);
    }
    initializeBaseDataURL() {
        let apiVersion = formatApiVersion(this.options.apiVersion);
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
//# sourceMappingURL=fetchQuery.js.map