import { Fetcher } from './fetcher';
import * as Promise from 'bluebird';
import * as urlJoin from 'url-join';
import { SalesforceOptions, formatApiVersion } from './salesforceOptions'
import * as querystring from 'querystring';


export class FetchQuery {
    fetcher: Fetcher;
    baseDataURL: string;
    options: SalesforceOptions;

    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchQuery {
        return new FetchQuery(fetcher, options);
    }

    constructor(fetcher: Fetcher, options: SalesforceOptions){
        this.fetcher = fetcher;
        this.options = options;

        this.initializeBaseDataURL();
    }

    private initializeBaseDataURL(){
        let apiVersion = formatApiVersion(this.options.apiVersion);
        this.baseDataURL = urlJoin(this.options.baseURL, 'services/data', apiVersion);
    }

    query(soqlQuery: string): Promise<any> {
        let encodedQuery = '?' + querystring.stringify({ q: soqlQuery });
        let fetchUrl = urlJoin(this.baseDataURL, 'query', encodedQuery);

        let fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}