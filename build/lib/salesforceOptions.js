"use strict";
var numeral = require('numeral');
let urlJoin = require('url-join');
let defaultOptions = {
    apiVersion: 33,
    authorizationResponseType: 'token'
};
function withDefaults(options) {
    let defaultOptionsCopy = Object.assign({}, defaultOptions);
    return Object.assign(defaultOptionsCopy, options);
}
exports.withDefaults = withDefaults;
function formatApiVersion(apiVersion) {
    return 'v' + numeral(apiVersion).format('0.0');
}
exports.formatApiVersion = formatApiVersion;
//# sourceMappingURL=salesforceOptions.js.map