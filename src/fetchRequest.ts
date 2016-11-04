let fetch = require('node-fetch');
import { FetchOptions } from './fetchOptions';
import Promise = require('bluebird');
fetch.Promise = Promise;

export function fetchJSON(fetchURL: string, fetchOptions: FetchOptions): Promise<any>{
    console.info('Fetching: ' + fetchURL);
    return fetch(fetchURL, fetchOptions)
        .then(response => response.json())
        .then(response => {
            if(response.error){
                let fetchJSONException = {
                    fetchURL: fetchURL,
                    fetchOptions: fetchOptions,
                    response: response
                }
                console.error(fetchJSONException);
                throw fetchJSONException;
            } else {
                return response;
            }
        });
}

