"use strict";
var index_1 = require('../index');
var Promise = require('bluebird');
function mockFetch(uri) {
    return Promise.resolve('hello david');
}
;
test('fetches content from github', function () {
    var baseURL = 'testbaseurl';
    var clientId = 'testclientid';
    var refreshToken = 'testrefreshtoken';
    var fetchSalesforce = new index_1.FetchSalesforce(baseURL, clientId, refreshToken);
    return fetchSalesforce.refreshAccessToken().then(function (token) { return expect(token).toBe('hello david'); });
});
//# sourceMappingURL=index.js.map