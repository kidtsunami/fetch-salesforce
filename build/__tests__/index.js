"use strict";
var index_1 = require('../index');
var salesforceOptions_1 = require('./salesforceOptions');
var Promise = require('bluebird');
function mockFetch(uri) {
    return Promise.resolve('hello david');
}
;
test('fetches content from github', function () {
    var options = salesforceOptions_1.withValidSalesforceOptions();
    var fetchSalesforce = new index_1.FetchSalesforce(options);
});
//# sourceMappingURL=index.js.map