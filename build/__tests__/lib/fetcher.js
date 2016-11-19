"use strict";
const salesforceOptions_1 = require('./salesforceOptions');
const fetcher_1 = require('../../lib/fetcher');
describe('fetcher', () => {
    let options = salesforceOptions_1.withRequiredSalesforceOptions();
    let fetcher;
    beforeEach(() => {
        fetcher = fetcher_1.Fetcher.Create(options);
    });
    it('initializes', () => {
        expect(fetcher).toBeDefined();
    });
});
//# sourceMappingURL=fetcher.js.map