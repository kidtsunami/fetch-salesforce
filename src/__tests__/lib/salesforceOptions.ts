import { SalesforceOptions, withDefaults, formatApiVersion } from '../../lib/salesforceOptions'
import { assert, expect, should } from "chai";

export function withValidSalesforceOptions(): SalesforceOptions{
    let testOptions: SalesforceOptions = {
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
    }

    return testOptions;
}
export function withRequiredSalesforceOptions(): SalesforceOptions{
    let testOptions: SalesforceOptions = {
        instanceURL: 'https://instanceURL/requiredtest/',
        clientID: 'testclientid',
        refreshToken: 'arefreshtoken',
    }

    return testOptions;
}

describe('withDefaults', () => {
    let testOptions: SalesforceOptions;
    describe('withValidOptions', () => {
        beforeEach(() => {
            testOptions = withValidSalesforceOptions();
        });

        it('does not override existing api version', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.apiVersion).to.equal(37);
        });

        it('does not override existing authorizationResponseType', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.authorizationResponseType).to.equal('code');
        });
    });

    describe('withRequiredOptions', () => {
        beforeEach(() => {
            testOptions = withRequiredSalesforceOptions();
            expect(testOptions.apiVersion).is.undefined;
        });

        it('sets default api version', () => {
            expect(testOptions.apiVersion).is.undefined;
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.apiVersion).to.equal(38);
        });

        it('sets default authorizationResponseType', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.authorizationResponseType).to.equal('token');
        });
    });
});

describe('formatApiVersion', () => {
    it('formats 38 as v38.0', () => {
        let formattedApiVersion = formatApiVersion(38);

        expect(formattedApiVersion).to.equal('v38.0');
    });
});