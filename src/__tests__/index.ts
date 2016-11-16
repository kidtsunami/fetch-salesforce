import sinon = require('sinon');
import { FetchSalesforce, SalesforceOptions } from '../index';
import { withValidSalesforceOptions } from './salesforceOptions';
import Promise = require('bluebird');

function mockFetch(uri: string): Promise<any> {
    return Promise.resolve('hello david');
};
 
test('fetches content from github', () => {
    let options = withValidSalesforceOptions();
    let fetchSalesforce = new FetchSalesforce(options);
});