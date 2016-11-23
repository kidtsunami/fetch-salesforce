import { Fetcher } from './fetcher';
import Promise = require('bluebird');
let urlJoin = require('url-join');
import { SalesforceOptions, formatApiVersion } from './salesforceOptions'
import { RequestOptions } from './requestOptions';
import * as querystring from 'querystring';


export class FetchChatter {
    fetcher: Fetcher;
    options: SalesforceOptions;

    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchChatter {
        return new FetchChatter(fetcher, options);
    }

    constructor(fetcher: Fetcher, options: SalesforceOptions){
        this.fetcher = fetcher;
        this.options = options;

        if(!this.options.sfdcCommunityID){
            console.log('SFDC Community ID is required to fetch Chatter');
        }
    }

    private getBaseChatterURL(){
        let apiVersion = formatApiVersion(this.options.apiVersion);
        return urlJoin(this.options.instanceURL, 'services/data',
            apiVersion, 'connect/communities', this.options.sfdcCommunityID, 
            'chatter');
    }

    retrieve(resource:string): Promise<any> {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.getBaseChatterURL(), resource);

        let fetchOptions: RequestOptions = {
            method: 'GET',
            cache: 'no-cache'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    
    private confirmCommunityID(){
        if(!this.options.sfdcCommunityID){
            throw 'SFDC Community ID is required to fetch Chatter';
        }
    }

    create(resource:string, body:any): Promise<any> {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.getBaseChatterURL(), resource);

        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }

    update(resource:string, id: string, body:any): Promise<any> {
        this.confirmCommunityID();
        if(!id){
            throw 'Invalid body for update, missing id'
        }
        let fetchUrl = urlJoin(this.getBaseChatterURL(), resource, id);

        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }

    delete(resource:string, id: string): Promise<any> {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.getBaseChatterURL(), resource, id);

        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'DELETE'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}