import { FetchSalesforce } from '../index';
import Promise = require('bluebird');

function mockFetch(uri: string): Promise<any> {
    return Promise.resolve('hello david');
};
 
test('fetches content from github', () => {
    let baseURL = 'testbaseurl';
    let clientId = 'testclientid';
    let refreshToken = 'testrefreshtoken';
    let fetchSalesforce = new FetchSalesforce(baseURL, clientId, refreshToken);
    return fetchSalesforce.refreshAccessToken().then(token => expect(token).toBe('hello david'));
});