"use strict";
var fetch = require('node-fetch');
var Promise = require('bluebird');
fetch.Promise = Promise;
function fetchJSON(requestURL, requestOptions) {
    console.info('Fetching: ' + requestURL);
    console.info(requestOptions);
    return fetch(requestURL, requestOptions)
        .then(function (response) { return response.json(); })
        .then(function (response) {
        if (response.error) {
            var fetchJSONException = {
                fetchURL: requestURL,
                requestOptions: requestOptions,
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