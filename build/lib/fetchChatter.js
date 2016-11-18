import * as urlJoin from 'url-join';
import { formatApiVersion } from './salesforceOptions';
export class FetchChatter {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        if (!this.options.sfdcCommunityID) {
            console.error('SFDC Community ID is required to fetch Chatter');
        }
        this.initializeBaseChatterURL();
    }
    static Create(fetcher, options) {
        return new FetchChatter(fetcher, options);
    }
    initializeBaseChatterURL() {
        let apiVersion = formatApiVersion(this.options.apiVersion);
        this.baseChatterURL = urlJoin(this.options.baseURL, 'services/data', apiVersion, 'connect/communities', this.options.sfdcCommunityID, 'chatter');
    }
    list() {
        this.confirmCommunityID();
        let fetchUrl = urlJoin(this.baseChatterURL, 'feeds/news/me/feed-elements');
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
        let fetchUrl = urlJoin(this.baseChatterURL, 'feed-elements');
        let bodyJSON = JSON.stringify(post);
        let fetchOptions = {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: bodyJSON
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
//# sourceMappingURL=fetchChatter.js.map