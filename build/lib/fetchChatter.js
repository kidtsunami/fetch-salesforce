"use strict";
var urlJoin = require('url-join');
var salesforceOptions_1 = require('./salesforceOptions');
var FetchChatter = (function () {
    function FetchChatter(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        if (!this.options.sfdcCommunityID) {
            console.error('SFDC Community ID is required to fetch Chatter');
        }
        this.initializeBaseChatterURL();
    }
    FetchChatter.prototype.initializeBaseChatterURL = function () {
        var apiVersion = salesforceOptions_1.formatApiVersion(this.options.apiVersion);
        this.baseChatterURL = urlJoin(this.options.baseURL, 'services/data', apiVersion, 'connect/communities', this.options.sfdcCommunityID, 'chatter');
    };
    FetchChatter.prototype.list = function () {
        this.confirmCommunityID();
        var fetchUrl = urlJoin(this.baseChatterURL, 'feeds/news/me/feed-elements');
        var fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    FetchChatter.prototype.confirmCommunityID = function () {
        if (!this.options.sfdcCommunityID) {
            throw 'SFDC Community ID is required to fetch Chatter';
        }
    };
    FetchChatter.prototype.post = function (post) {
        this.confirmCommunityID();
        var fetchUrl = urlJoin(this.baseChatterURL, 'feed-elements');
        var bodyJSON = JSON.stringify(post);
        var fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    };
    return FetchChatter;
}());
exports.FetchChatter = FetchChatter;
//# sourceMappingURL=fetchChatter.js.map