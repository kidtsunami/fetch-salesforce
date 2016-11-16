import sinon = require('sinon');
import { FetchSalesforce, SalesforceOptions } from '../index';
import { withValidSalesforceOptions } from './salesforceOptions';
import Promise = require('bluebird');

test('fetches content from github', () => {
    let options = withValidSalesforceOptions();
    let fetchSalesforce = new FetchSalesforce(options);
});