"use strict";
var fetchRequest_1 = require('./fetchRequest');
var querystring = require('querystring');
var FetchSalesforce = (function () {
    function FetchSalesforce(baseURL, clientID, refreshToken) {
        this.baseURL = baseURL;
        this.clientID = clientID;
        this.refreshToken = refreshToken;
    }
    FetchSalesforce.prototype.refreshAccessToken = function () {
        var _this = this;
        var fetchUrl = this.baseURL + 'services/oauth2/token';
        var accessToken;
        var fetchBody = {
            grant_type: 'refresh_token',
            refresh_token: this.refreshToken,
            client_id: this.clientID,
            format: 'json'
        };
        var fetchOptions = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            cache: false,
            body: querystring.stringify(fetchBody)
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions)
            .then(function (response) {
            _this.accessToken = response.access_token;
            return response;
        });
    };
    FetchSalesforce.prototype.getAccounts = function () {
        var fetchUrl = this.baseURL + 'services/data/v33.0/query/?q=SELECT%20Id%2C%20Name%20FROM%20Account';
        var fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken
            },
            method: 'GET',
            cache: false
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSalesforce.prototype.query = function (soqlQuery) {
        var encodedQuery = querystring.stringify({ q: soqlQuery });
        var fetchUrl = this.baseURL + 'services/data/v33.0/query/?' + encodedQuery;
        var fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken
            },
            method: 'GET',
            cache: false
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSalesforce.prototype.post = function (sobjectName, body) {
        var fetchUrl = this.baseURL + 'services/data/v33.0/' + sobjectName + '/';
        var bodyJSON = JSON.stringify(body);
        var fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: bodyJSON
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSalesforce.prototype.patch = function (sobjectName, id, body) {
        var fetchUrl = this.baseURL + 'services/data/v33.0/' + sobjectName + '/' + id;
        var bodyJSON = JSON.stringify(body);
        var fetchOptions = {
            headers: {
                'Authorization': 'Authorization: Bearer ' + this.accessToken,
                'Content-Type': 'application/json'
            },
            method: 'PATCH',
            body: bodyJSON
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    return FetchSalesforce;
}());
exports.FetchSalesforce = FetchSalesforce;
//# sourceMappingURL=index.js.map