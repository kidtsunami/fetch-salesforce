"use strict";
var fetch = require('node-fetch');
var Promise = require('bluebird');
fetch.Promise = Promise;
function fetchJSON(fetchURL, fetchOptions) {
    console.info('Fetching: ' + fetchURL);
    return fetch(fetchURL, fetchOptions)
        .then(function (response) { return response.json(); })
        .then(function (response) {
        if (response.error) {
            var fetchJSONException = {
                fetchURL: fetchURL,
                fetchOptions: fetchOptions,
                response: response
            };
            console.error(fetchJSONException);
            throw fetchJSONException;
        }
        else {
            return response;
        }
    });
}
exports.fetchJSON = fetchJSON;
//# sourceMappingURL=fetchRequest.js.map