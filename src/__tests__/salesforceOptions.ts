import { SalesforceOptions, withDefaults, formatApiVersion } from '../lib/salesforceOptions'

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
export function withRequiredSalesforceOptions(): SalesforceOptions{
    let testOptions: SalesforceOptions = {
        baseURL: 'https://baseurl/test/',
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

            expect(testOptionsWithDefaults.apiVersion).toBe(37);
        });

        it('does not override existing service URLS', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptions.authorizationServiceURL).toBe('https://baseurl2/test/authorize');
            expect(testOptions.tokenServiceURL).toBe('https://baseurl3/test/token');
            expect(testOptions.revokeServiceURL).toBe('https://baseurl4/test/revoke');
        });
    });

    describe('withRequiredOptions', () => {
        beforeEach(() => {
            testOptions = withRequiredSalesforceOptions();
        });

        it('sets default api version', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.apiVersion).toBe(33);
        });

        it('does not override existing service URLS', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.authorizationServiceURL).toBe('https://baseurl/test/services/oauth2/authorize');
            expect(testOptionsWithDefaults.tokenServiceURL).toBe('https://baseurl/test/services/oauth2/token');
            expect(testOptionsWithDefaults.revokeServiceURL).toBe('https://baseurl/test/services/oauth2/revoke');
        });
    });
});

describe('formatApiVersion', () => {
    it('formats 33 as v33.0', () => {
        let formattedApiVersion = formatApiVersion(33);

        expect(formattedApiVersion).toBe('v33.0');
    });
});