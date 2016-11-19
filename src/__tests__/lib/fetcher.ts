import { withRequiredSalesforceOptions } from './salesforceOptions';

import { Fetcher } from '../../lib/fetcher';
import { SalesforceOptions } from '../../lib/salesforceOptions';

describe('fetcher', () => {
    let options: SalesforceOptions = withRequiredSalesforceOptions();
    let fetcher: Fetcher; 
    beforeEach(() => {
         fetcher = Fetcher.Create(options);
    });

    it('initializes', () => {
        expect(fetcher).toBeDefined();
    })
});