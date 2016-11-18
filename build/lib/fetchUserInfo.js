"use strict";
let urlJoin = require('url-join');
class FetchUserInfo {
    constructor(fetcher, options) {
        this.fetcher = fetcher;
        this.options = options;
        this.initializeBaseUserInfoURL();
    }
    static Create(fetcher, options) {
        return new FetchUserInfo(fetcher, options);
    }
    initializeBaseUserInfoURL() {
        this.baseUserInfoURL = urlJoin(this.options.instanceURL, 'services/oauth2/userinfo');
    }
    get() {
        let fetchUrl = urlJoin(this.baseUserInfoURL);
        let fetchOptions = {
            method: 'GET',
            cache: false
        };
        return this.fetcher.fetchJSON(fetchUrl, fetchOptions);
    }
}
exports.FetchUserInfo = FetchUserInfo;
//# sourceMappingURL=fetchUserInfo.js.map