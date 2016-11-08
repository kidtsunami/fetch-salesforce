import { FetchSalesforce, SalesforceOptions } from '../index';
import Promise = require('bluebird');

function mockFetch(uri: string): Promise<any> {
    return Promise.resolve('hello david');
};
 
test('fetches content from github', () => {
    let baseURL = 'testbaseurl';
    let clientId = 'testclientid';
    let refreshToken = 'testrefreshtoken';
    let options: SalesforceOptions = {
        baseURL: 'testbaseurl',
        clientID: 'testclientid',
        refreshToken: 'testrefreshtoken'
    }
    let fetchSalesforce = new FetchSalesforce(options);
});