import { formatApiVersion } from './salesforceOptions';
import * as urlJoin from 'url-join';
export class FetchSObject {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseDataURL();
    }
    static Create(fetcher, options) {
        return new FetchSObject(fetcher, options);
    }
    initializeBaseDataURL() {
        let apiVersion = formatApiVersion(this.options.apiVersion);
        this.baseDataURL = urlJoin(this.options.baseURL, 'services/data', apiVersion);
    }
    insert(sobjectName, body) {
        let fetchUrl = this.getSObjectUrl(sobjectName);
        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    getSObjectUrl(sobjectName) {
        return urlJoin(this.baseDataURL, sobjectName);
    }
    get(sobjectName, id) {
        let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    update(sobjectName, body) {
        if (!body.id) {
            throw {
                error: 'Invalid body for update, missing id',
                body: body
            };
        }
        let bodyJSON = JSON.stringify(body);
        let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), body.id);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    delete(sobjectName, id) {
        let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);
        let fetchOptions = {
            method: 'DELETE'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
//# sourceMappingURL=fetchSObject.js.map