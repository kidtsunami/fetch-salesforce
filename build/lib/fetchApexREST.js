import * as urlJoin from 'url-join';
export class FetchApexREST {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseApexRESTURL();
    }
    static Create(fetcher, options) {
        return new FetchApexREST(fetcher, options);
    }
    initializeBaseApexRESTURL() {
        this.baseApexRESTURL = urlJoin(this.options.baseURL, 'apexrest');
    }
    get(endpointPath) {
        let fetchUrl = urlJoin(this.getEndpointURL(endpointPath));
        let fetchOptions = {
            method: 'GET'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    getEndpointURL(endpointPath) {
        return urlJoin(this.baseApexRESTURL, endpointPath);
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
//# sourceMappingURL=fetchApexREST.js.map