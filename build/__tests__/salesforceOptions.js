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
function withRequiredSalesforceOptions() {
    var testOptions = {
        baseURL: 'https://baseurl/test/',
        clientID: 'testclientid',
        refreshToken: 'arefreshtoken',
    };
    return testOptions;
}
exports.withRequiredSalesforceOptions = withRequiredSalesforceOptions;
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
        it('does not override existing service URLS', function () {
            var testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptions.authorizationServiceURL).toBe('https://baseurl2/test/authorize');
            expect(testOptions.tokenServiceURL).toBe('https://baseurl3/test/token');
            expect(testOptions.revokeServiceURL).toBe('https://baseurl4/test/revoke');
        });
    });
    describe('withRequiredOptions', function () {
        beforeEach(function () {
            testOptions = withRequiredSalesforceOptions();
        });
        it('sets default api version', function () {
            var testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.apiVersion).toBe(33);
        });
        it('does not override existing service URLS', function () {
            var testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.authorizationServiceURL).toBe('https://baseurl/test/services/oauth2/authorize');
            expect(testOptionsWithDefaults.tokenServiceURL).toBe('https://baseurl/test/services/oauth2/token');
            expect(testOptionsWithDefaults.revokeServiceURL).toBe('https://baseurl/test/services/oauth2/revoke');
        });
    });
});
describe('formatApiVersion', function () {
    it('formats 33 as v33.0', function () {
        var formattedApiVersion = salesforceOptions_1.formatApiVersion(33);
        expect(formattedApiVersion).toBe('v33.0');
    });
});
//# sourceMappingURL=salesforceOptions.js.map