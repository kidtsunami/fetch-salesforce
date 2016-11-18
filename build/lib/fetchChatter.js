"use strict";
let urlJoin = require('url-join');
const salesforceOptions_1 = require('./salesforceOptions');
class FetchChatter {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        if (!this.options.sfdcCommunityID) {
            console.log('SFDC Community ID is required to fetch Chatter');
        }
    }
    static Create(fetcher, options) {
        return new FetchChatter(fetcher, options);
    }
    getBaseChatterURL() {
        let apiVersion = salesforceOptions_1.formatApiVersion(this.options.apiVersion);
        return urlJoin(this.options.instanceURL, 'services/data', apiVersion, 'connect/communities', this.options.sfdcCommunityID, 'chatter');
    }
    list() {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.getBaseChatterURL(), 'feeds/news/me/feed-elements');
        let fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
    confirmCommunityID() {
        if (!this.options.sfdcCommunityID) {
            throw 'SFDC Community ID is required to fetch Chatter';
        }
    }
    post(post) {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.getBaseChatterURL(), 'feed-elements');
        let bodyJSON = JSON.stringify(post);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
exports.FetchChatter = FetchChatter;
//# sourceMappingURL=fetchChatter.js.map