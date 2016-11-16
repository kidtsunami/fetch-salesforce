import { SalesforceOptions, withDefaults } from '../lib/salesforceOptions'

export function withValidSalesforceOptions(): SalesforceOptions{
    let testOptions: SalesforceOptions = {
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

            expect(testOptionsWithDefaults.apiVersion).toBe(37);
        });
    });
});