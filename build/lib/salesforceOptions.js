"use strict";
var numeral = require('numeral');
var defaultOptions = {
    apiVersion: 33
};
function withDefaults(options) {
    return Object.assign(defaultOptions, options);
}
exports.withDefaults = withDefaults;
function formatApiVersion(apiVersion) {
    return 'v' + numeral(apiVersion).format('0.0');
}
exports.formatApiVersion = formatApiVersion;
//# sourceMappingURL=salesforceOptions.js.map