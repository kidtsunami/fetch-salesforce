
import { fetchJSON } from './fetchRequest';
import * as querystring from 'querystring';

export class FetchSalesforce {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    accessToken: string;

    constructor(baseURL: string, clientID: string, refreshToken: string){
        this.baseURL = baseURL;
        this.clientID = clientID;
        this.refreshToken = refreshToken;
    }

    refreshAccessToken(): Promise<any> {
        let fetchUrl = this.baseURL + 'services/oauth2/token';
        let accessToken: string;

        let fetchBody = {
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
            client_id: this.clientID,
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

    getAccounts(): Promise<any> {
        let fetchUrl = this.baseURL + 'services/data/v33.0/query/?q=SELECT%20Id%2C%20Name%20FROM%20Account';

        let fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken
            },
            method: 'GET',
            cache: false
        };
        return fetchJSON(fetchUrl, fetchOptions);
    }

    query(soqlQuery: string): Promise<any> {
        let encodedQuery = querystring.stringify({ q: soqlQuery });
        let fetchUrl = this.baseURL + 'services/data/v33.0/query/?' + encodedQuery;

        let fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken
            },
            method: 'GET',
            cache: false
        };
        return fetchJSON(fetchUrl, fetchOptions);
    }

    post(sobjectName: string, body: any): Promise<any> {
        let fetchUrl = this.baseURL + 'services/data/v33.0/' + sobjectName + '/';
        
        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: bodyJSON
        };
        return fetchJSON(fetchUrl, fetchOptions);
    }

    patch(sobjectName: string, id: string, body: any): Promise<any> {
        let fetchUrl = this.baseURL + 'services/data/v33.0/' + sobjectName + '/' + id;

        let bodyJSON = JSON.stringify(body);
        let fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: bodyJSON
        };
        return fetchJSON(fetchUrl, fetchOptions);
    }
}