"use strict";
const salesforceOptions_1 = require('../../lib/salesforceOptions');
function withValidSalesforceOptions() {
    let testOptions = {
        instanceURL: 'https://instanceURL/test/',
        clientID: 'testclientid',
        clientSecret: 'testclientsecret',
        refreshToken: 'arefreshtoken',
        apiVersion: 37,
        sfdcCommunityID: 'avalidcommunityid',
        authorizationServiceURL: 'https://instanceURL2/test/authorize',
        authorizationResponseType: 'code',
        tokenServiceURL: 'https://instanceURL3/test/token',
        revokeServiceURL: 'https://instanceURL4/test/revoke',
        redirectUri: 'https://instanceURL2/test/redirrrrect',
    };
    return testOptions;
}
exports.withValidSalesforceOptions = withValidSalesforceOptions;
function withRequiredSalesforceOptions() {
    let testOptions = {
        instanceURL: 'https://instanceURL/requiredtest/',
        clientID: 'testclientid',
        refreshToken: 'arefreshtoken',
    };
    return testOptions;
}
exports.withRequiredSalesforceOptions = withRequiredSalesforceOptions;
describe('withDefaults', () => {
    let testOptions;
    describe('withValidOptions', () => {
        beforeEach(() => {
            testOptions = withValidSalesforceOptions();
        });
        it('does not override existing api version', () => {
            let testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.apiVersion).toBe(37);
        });
        it('does not override existing authorizationResponseType', () => {
            let testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.authorizationResponseType).toBe('code');
        });
        it('does not override existing service URLS', () => {
            let testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptions.authorizationServiceURL).toBe('https://instanceURL2/test/authorize');
            expect(testOptions.tokenServiceURL).toBe('https://instanceURL3/test/token');
            expect(testOptions.revokeServiceURL).toBe('https://instanceURL4/test/revoke');
        });
    });
    describe('withRequiredOptions', () => {
        beforeEach(() => {
            testOptions = withRequiredSalesforceOptions();
        });
        it('sets default api version', () => {
            let testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.apiVersion).toBe(33);
        });
        it('sets default authorizationResponseType', () => {
            let testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.authorizationResponseType).toBe('token');
        });
        it('does not override existing service URLS', () => {
            let testOptionsWithDefaults = salesforceOptions_1.withDefaults(testOptions);
            expect(testOptionsWithDefaults.authorizationServiceURL).toBe('https://instanceURL/requiredtest/services/oauth2/authorize');
            expect(testOptionsWithDefaults.tokenServiceURL).toBe('https://instanceURL/requiredtest/services/oauth2/token');
            expect(testOptionsWithDefaults.revokeServiceURL).toBe('https://instanceURL/requiredtest/services/oauth2/revoke');
        });
    });
});
describe('formatApiVersion', () => {
    it('formats 33 as v33.0', () => {
        let formattedApiVersion = salesforceOptions_1.formatApiVersion(33);
        expect(formattedApiVersion).toBe('v33.0');
    });
});
//# sourceMappingURL=salesforceOptions.js.map