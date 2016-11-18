"use strict";
var salesforceOptions_1 = require('./salesforceOptions');
var urlJoin = require('url-join');
var FetchSObject = (function () {
    function FetchSObject(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseDataURL();
    }
    FetchSObject.Create = function (fetcher, options) {
        return new FetchSObject(fetcher, options);
    };
    FetchSObject.prototype.initializeBaseDataURL = function () {
        var apiVersion = salesforceOptions_1.formatApiVersion(this.options.apiVersion);
        this.baseDataURL = urlJoin(this.options.baseURL, 'services/data', apiVersion);
    };
    FetchSObject.prototype.insert = function (sobjectName, body) {
        var fetchUrl = this.getSObjectUrl(sobjectName);
        var bodyJSON = JSON.stringify(body);
        var fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSObject.prototype.getSObjectUrl = function (sobjectName) {
        return urlJoin(this.baseDataURL, sobjectName);
    };
    FetchSObject.prototype.get = function (sobjectName, id) {
        var fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);
        var fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'GET'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSObject.prototype.update = function (sobjectName, body) {
        if (!body.id) {
            throw {
                error: 'Invalid body for update, missing id',
                body: body
            };
        }
        var bodyJSON = JSON.stringify(body);
        var fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), body.id);
        var fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'PATCH',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchSObject.prototype.delete = function (sobjectName, id) {
        var fetchUrl = urlJoin(this.getSObjectUrl(sobjectName), id);
        var fetchOptions = {
            method: 'DELETE'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    return FetchSObject;
}());
exports.FetchSObject = FetchSObject;
//# sourceMappingURL=fetchSObject.js.map