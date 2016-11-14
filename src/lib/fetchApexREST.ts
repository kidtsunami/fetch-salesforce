
import { Fetcher } from './fetcher';
import { SalesforceOptions, formatApiVersion } from './salesforceOptions'
let urlJoin = require('url-join');

export class FetchApexREST {
    fetcher: Fetcher;
    baseApexRESTURL: string;
    options: SalesforceOptions;

    constructor(fetcher: Fetcher, options: SalesforceOptions){
        this.fetcher = fetcher;
        this.options = options;

        this.initializeBaseApexRESTURL();
    }

    private initializeBaseApexRESTURL(){
        this.baseApexRESTURL = urlJoin(this.options.baseURL, 'apexrest');
    }

    get(endpointPath: string): Promise<any> {
        let fetchUrl = urlJoin(this.getEndpointURL(endpointPath));

        let fetchOptions = {
            method: 'GET'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }

    private getEndpointURL(endpointPath: string){
        return urlJoin(this.baseApexRESTURL, endpointPath);
    }

    post(endpointPath: string, body: any): Promise<any> {
        let fetchUrl = this.getEndpointURL(endpointPath);
        
        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }

    patch(endpointPath: string, body: any): Promise<any> {
        let bodyJSON = JSON.stringify(body);
        let fetchUrl = urlJoin(this.getEndpointURL(endpointPath), body.id);

        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }

    delete(endpointPath: string): Promise<any> {
        let fetchUrl = urlJoin(this.getEndpointURL(endpointPath));

        let fetchOptions = {
            method: 'DELETE'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}