
import { fetchJSON } from './fetchRequest';
import { FetchSalesforceOptions, withDefaultFetchSalesforceOptions } from './fetchSalesforceOptions'

import * as querystring from 'querystring';
let urlJoin = require('url-join');
let numeral = require('numeral');

export class FetchSalesforce {
    options: FetchSalesforceOptions;
    baseDataURL: string;
    accessToken: string;

    constructor(options: FetchSalesforceOptions){
        this.options = withDefaultFetchSalesforceOptions(options);
        this.initializeBaseDataURL();
    }

    private initializeBaseDataURL(){
        this.baseDataURL = urlJoin(this.options.baseURL, 'services/data', this.formatApiVersion());
    }

    private formatApiVersion(){
        return 'v' + numeral(this.options.apiVersion).format('0.0');
    }

    refreshAccessToken(): Promise<any> {
        let fetchUrl = this.options.baseURL + 'services/oauth2/token';
        let accessToken: string;

        let fetchBody = {
            grant_type: 'refresh_token',
            refresh_token: this.options.refreshToken,
            client_id: this.options.clientID,
            format: 'json'
        };

        let fetchOptions = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            cache: false,
            body: querystring.stringify(fetchBody)
        };
        return fetchJSON(fetchUrl, fetchOptions)
            .then((response) => {
                this.accessToken = response.access_token;
                return response;
            });
    }

    query(soqlQuery: string): Promise<any> {
        let encodedQuery = '?' + querystring.stringify({ q: soqlQuery });
        let fetchUrl = urlJoin(this.baseDataURL, 'query', encodedQuery);

        let fetchOptions = {
            headers: this.buildAuthorizedHeaders(),
            method: 'GET',
            cache: false
        };
        return fetchJSON(fetchUrl, fetchOptions);
    }

    private buildAuthorizedHeaders(headers?: any): any {
        let authorizedHeader = {
            'Authorization': 'Authorization: Bearer ' + this.accessToken
        }
        return Object.assign(authorizedHeader, headers);
    }

    insert(sobjectName: string, body: any): Promise<any> {
        let fetchUrl = this.getSObjectUrl(sobjectName);
        
        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: this.buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
            method: 'POST',
            body: bodyJSON
        };
        return fetchJSON(fetchUrl, fetchOptions);
    }

    private getSObjectUrl(sobjectName: string){
        return urlJoin(this.baseDataURL, sobjectName);
    }

    update(sobjectName: string, body: any): Promise<any> {
        if(!body.id){
            throw {
                error: 'Invalid body for update, missing id',
                body: body
            }
        }
        let bodyJSON = JSON.stringify(body);
        let fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), body.id);

        let fetchOptions = {
            headers: this.buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
            method: 'PATCH',
            body: bodyJSON
        };
        return fetchJSON(fetchUrl, fetchOptions);
    }
}