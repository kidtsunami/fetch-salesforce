"use strict";
const index_1 = require('../index');
const salesforceOptions_1 = require('./lib/salesforceOptions');
test('exports FetchSalesforce and SalesforceOptions', () => {
    let options = salesforceOptions_1.withRequiredSalesforceOptions();
    let fetchSalesforce = new index_1.FetchSalesforce(options);
});
//# sourceMappingURL=index.js.map