"use strict";
let urlJoin = require('url-join');
class FetchUserInfo {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
    }
    static Create(fetcher, options) {
        return new FetchUserInfo(fetcher, options);
    }
    getBaseUserInfoURL() {
        return urlJoin(this.options.instanceURL, 'services/oauth2/userinfo');
    }
    get() {
        let fetchUrl = this.getBaseUserInfoURL();
        let fetchOptions = {
            method: 'GET',
            cache: 'no-cache'
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
exports.FetchUserInfo = FetchUserInfo;
//# sourceMappingURL=fetchUserInfo.js.map