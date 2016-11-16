import { Fetcher } from './fetcher';
let urlJoin = require('url-join');
import { SalesforceOptions, formatApiVersion } from './salesforceOptions'
import * as querystring from 'querystring';


export class FetchChatter {
    fetcher: Fetcher;
    baseChatterURL: string;
    options: SalesforceOptions;

    constructor(fetcher: Fetcher, options: SalesforceOptions){
        this.fetcher = fetcher;
        this.options = options;

        if(!this.options.sfdcCommunityID){
            console.error('SFDC Community ID is required to fetch Chatter');
        }

        this.initializeBaseChatterURL();
    }

    private initializeBaseChatterURL(){
        let apiVersion = formatApiVersion(this.options.apiVersion);
        this.baseChatterURL = urlJoin(this.options.baseURL, 'services/data',
            apiVersion, 'connect/communities', this.options.sfdcCommunityID, 
            'chatter');
    }

    list(): Promise<any> {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.baseChatterURL, 'feeds/news/me/feed-elements');

        let fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }

    private confirmCommunityID(){
        if(!this.options.sfdcCommunityID){
            throw 'SFDC Community ID is required to fetch Chatter';
        }
    }

    post(post: any): Promise<any> {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.baseChatterURL, 'feed-elements');
        
        let bodyJSON = JSON.stringify(post);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}