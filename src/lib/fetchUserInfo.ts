import { Fetcher } from './fetcher';
import Promise = require('bluebird');
let urlJoin = require('url-join');
import { SalesforceOptions, formatApiVersion } from './salesforceOptions'
import * as querystring from 'querystring';


export class FetchUserInfo {
    fetcher: Fetcher;
    baseUserInfoURL: string;
    options: SalesforceOptions;

    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchUserInfo {
        return new FetchUserInfo(fetcher, options);
    }

    constructor(fetcher: Fetcher, options: SalesforceOptions){
        this.fetcher = fetcher;
        this.options = options;

        this.initializeBaseUserInfoURL();
    }

    private initializeBaseUserInfoURL(){
        this.baseUserInfoURL = urlJoin(this.options.baseURL, 'services/oauth2/userinfo');
    }

    get(): Promise<any> {
        let fetchUrl = urlJoin(this.baseUserInfoURL);

        let fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}