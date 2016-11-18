"use strict";
var numeral = require('numeral');
let urlJoin = require('url-join');
let defaultOptions = {
    apiVersion: 33,
    authorizationResponseType: 'token'
};
function withDefaults(options) {
    let defaultOptionsByinstanceURL = Object.assign({}, defaultOptions);
    defaultOptionsByinstanceURL.authorizationServiceURL = urlJoin(options.instanceURL, '/services/oauth2/authorize');
    defaultOptionsByinstanceURL.tokenServiceURL = urlJoin(options.instanceURL, '/services/oauth2/token');
    defaultOptionsByinstanceURL.revokeServiceURL = urlJoin(options.instanceURL, '/services/oauth2/revoke');
    return Object.assign(defaultOptionsByinstanceURL, options);
}
exports.withDefaults = withDefaults;
function formatApiVersion(apiVersion) {
    return 'v' + numeral(apiVersion).format('0.0');
}
exports.formatApiVersion = formatApiVersion;
//# sourceMappingURL=salesforceOptions.js.map