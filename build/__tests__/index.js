import { FetchSalesforce } from '../index';
import { withRequiredSalesforceOptions } from './lib/salesforceOptions';
test('exports FetchSalesforce and SalesforceOptions', () => {
    let options = withRequiredSalesforceOptions();
    let fetchSalesforce = new FetchSalesforce(options);
});
//# sourceMappingURL=index.js.map