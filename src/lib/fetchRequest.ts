let fetch = require('node-fetch');
import { RequestOptions } from './requestOptions';
import Promise = require('bluebird');
fetch.Promise = Promise;

export function fetchJSON(requestURL: string, requestOptions: RequestOptions): Promise<any>{
    console.info('Fetching: ' + requestURL);
    console.info(requestOptions);
    return fetch(requestURL, requestOptions)
        .then(response => response.json())
        .then(response => {
            if(response.error){
                let fetchJSONException = {
                    fetchURL: requestURL,
                    requestOptions: requestOptions,
                    response: response
                }
                console.error(fetchJSONException);
                throw fetchJSONException;
            } else {
                return response;
            }
        });
}

