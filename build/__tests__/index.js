"use strict";
var index_1 = require('../index');
var salesforceOptions_1 = require('./lib/salesforceOptions');
test('exports FetchSalesforce and SalesforceOptions', function () {
    var options = salesforceOptions_1.withRequiredSalesforceOptions();
    var fetchSalesforce = new index_1.FetchSalesforce(options);
});
//# sourceMappingURL=index.js.map