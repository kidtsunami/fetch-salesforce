"use strict";
var fetchRequest_1 = require('./fetchRequest');
var fetchSalesforceOptions_1 = require('./fetchSalesforceOptions');
var querystring = require('querystring');
var urlJoin = require('url-join');
var numeral = require('numeral');
var FetchSalesforce = (function () {
    function FetchSalesforce(options) {
        this.options = fetchSalesforceOptions_1.withDefaultFetchSalesforceOptions(options);
        this.initializeBaseDataURL();
    }
    FetchSalesforce.prototype.initializeBaseDataURL = function () {
        this.baseDataURL = urlJoin(this.options.baseURL, 'services/data', this.formatApiVersion());
    };
    FetchSalesforce.prototype.formatApiVersion = function () {
        return 'v' + numeral(this.options.apiVersion).format('0.0');
    };
    FetchSalesforce.prototype.refreshAccessToken = function () {
        var _this = this;
        var fetchUrl = this.options.baseURL + 'services/oauth2/token';
        var accessToken;
        var fetchBody = {
            grant_type: 'refresh_token',
            refresh_token: this.options.refreshToken,
            client_id: this.options.clientID,
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
    FetchSalesforce.prototype.query = function (soqlQuery) {
        var encodedQuery = '?' + querystring.stringify({ q: soqlQuery });
        var fetchUrl = urlJoin(this.baseDataURL, 'query', encodedQuery);
        var fetchOptions = {
            headers: this.buildAuthorizedHeaders(),
            method: 'GET',
            cache: false
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSalesforce.prototype.buildAuthorizedHeaders = function (headers) {
        var authorizedHeader = {
            'Authorization': 'Authorization: Bearer ' + this.accessToken
        };
        return Object.assign(authorizedHeader, headers);
    };
    FetchSalesforce.prototype.insert = function (sobjectName, body) {
        var fetchUrl = this.getSObjectUrl(sobjectName);
        var bodyJSON = JSON.stringify(body);
        var fetchOptions = {
            headers: this.buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
            method: 'POST',
            body: bodyJSON
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSalesforce.prototype.getSObjectUrl = function (sobjectName) {
        return urlJoin(this.baseDataURL, sobjectName);
    };
    FetchSalesforce.prototype.update = function (sobjectName, body) {
        if (!body.id) {
            throw {
                error: 'Invalid body for update, missing id',
                body: body
            };
        }
        var bodyJSON = JSON.stringify(body);
        var fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), body.id);
        var fetchOptions = {
            headers: this.buildAuthorizedHeaders({ 'Content-Type': 'application/json' }),
            method: 'PATCH',
            body: bodyJSON
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSalesforce.prototype.delete = function (sobjectName, id) {
        var fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);
        var fetchOptions = {
            headers: this.buildAuthorizedHeaders(),
            method: 'DELETE'
        };
        return fetchRequest_1.fetchJSON(fetchUrl, fetchOptions);
    };
    return FetchSalesforce;
}());
exports.FetchSalesforce = FetchSalesforce;
//# sourceMappingURL=fetchSalesforce.js.map