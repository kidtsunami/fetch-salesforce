import { SalesforceOptions, withDefaults, formatApiVersion } from '../../lib/salesforceOptions'

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

            expect(testOptionsWithDefaults.apiVersion).toBe(37);
        });

        it('does not override existing authorizationResponseType', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.authorizationResponseType).toBe('code');
        });
    });

    describe('withRequiredOptions', () => {
        beforeEach(() => {
            testOptions = withRequiredSalesforceOptions();
            expect(testOptions.apiVersion).toBeUndefined();
        });

        it('sets default api version', () => {
            expect(testOptions.apiVersion).toBeUndefined();
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.apiVersion).toBe(33);
        });

        it('sets default authorizationResponseType', () => {
            let testOptionsWithDefaults = withDefaults(testOptions);

            expect(testOptionsWithDefaults.authorizationResponseType).toBe('token');
        });
    });
});

describe('formatApiVersion', () => {
    it('formats 33 as v33.0', () => {
        let formattedApiVersion = formatApiVersion(33);

        expect(formattedApiVersion).toBe('v33.0');
    });
});