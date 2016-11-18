var numeral = require('numeral');
import * as urlJoin from 'url-join';
let defaultOptions = {
    apiVersion: 33
};
export function withDefaults(options) {
    let defaultOptionsByBaseURL = Object.assign({}, defaultOptions);
    defaultOptionsByBaseURL.authorizationServiceURL = urlJoin(options.baseURL, '/services/oauth2/authorize');
    defaultOptionsByBaseURL.tokenServiceURL = urlJoin(options.baseURL, '/services/oauth2/token');
    defaultOptionsByBaseURL.revokeServiceURL = urlJoin(options.baseURL, '/services/oauth2/revoke');
    return Object.assign(defaultOptionsByBaseURL, options);
}
export function formatApiVersion(apiVersion) {
    return 'v' + numeral(apiVersion).format('0.0');
}
//# sourceMappingURL=salesforceOptions.js.map