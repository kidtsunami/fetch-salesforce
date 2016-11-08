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
    var options = {
        baseURL: 'testbaseurl',
        clientID: 'testclientid',
        refreshToken: 'testrefreshtoken'
    };
    var fetchSalesforce = new index_1.FetchSalesforce(options);
});
//# sourceMappingURL=index.js.map