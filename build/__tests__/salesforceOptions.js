"use strict";
var salesforceOptions_1 = require('../lib/salesforceOptions');
function withValidSalesforceOptions() {
    var testOptions = {
        baseURL: 'https://baseurl/test/',
        clientID: 'testclientid',
        clientSecret: 'testclientsecret',
        refreshToken: 'arefreshtoken',
        apiVersion: 37,
        sfdcCommunityID: 'avalidcommunityid',
        authorizationServiceURL: 'https://baseurl2/test/authorize',
        tokenServiceURL: 'https://baseurl3/test/token',
        revokeServiceURL: 'https://baseurl4/test/revoke',
        redirectUri: 'https://baseurl2/test/redirrrrect',
    };
    return testOptions;
}
exports.withValidSalesforceOptions = withValidSalesforceOptions;
describe('withDefaults', function () {
    var testOptions;
    describe('withValidOptions', function () {
        beforeEach(function () {
            testOptions = withValidSalesforceOptions();
        });
        it('does not override existing api version', function () {
            var testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.apiVersion).toBe(37);
        });
    });
});
//# sourceMappingURL=salesforceOptions.js.map