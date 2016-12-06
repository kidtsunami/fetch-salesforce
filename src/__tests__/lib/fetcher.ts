import sinon = require('sinon');
import { withRequiredSalesforceOptions } from './salesforceOptions';
import fetchMock = require('fetch-mock');

import { Fetcher } from '../../lib/fetcher';
import { SalesforceOptions } from '../../lib/salesforceOptions';
let fetch = require('isomorphic-fetch');


let refreshAccessTokenResponse = {
    json: () =>  {
        return {
            access_token: 'refreshedAccessToken'
        };
    }
}
fetchMock.mock('https://instanceURL/requiredtest/services/oauth2/token', refreshAccessTokenResponse);

describe('fetcher', () => {
    let options: SalesforceOptions = withRequiredSalesforceOptions();
    let fetcher: Fetcher;

    describe('constructor', () => {
        describe('withRequiredSalesforceOptions', () => {
            beforeEach(() => {
                fetcher = Fetcher.Create(options);
            });

            it('initializes', () => {
                expect(fetcher).toBeDefined();
                expect(fetcher.options).toEqual(options);
                expect(fetcher.isRefreshingAccessToken).toBe(false);
            })
        });

        describe('withRequiredSalesforceOptions and prepopulated accessToken', () => {
            beforeEach(() => {
                options.accessToken = 'populated accessToken';
                fetcher = Fetcher.Create(options);
            });

            it('initializes with undefined accessToken', () => {
                expect(fetcher).toBeDefined();
                expect(fetcher.options).toBeDefined();
                expect(fetcher.options.accessToken).toBeUndefined();
                expect(fetcher.isRefreshingAccessToken).toBe(false);
            });
        });
    });

    describe('getAccessToken', () => {
        beforeEach(() => {
            fetcher = Fetcher.Create(options);
        });

        afterEach(() => {
        });

        it('returns accessToken if there', () => {
            let expectedAccessToken = 'existingAccessToken';
            fetcher.options.accessToken = expectedAccessToken;

            return fetcher.getAccessToken()
                .then((actualAccessToken) => {
                    expect(actualAccessToken).toEqual(expectedAccessToken);
                });
        });

        it('refreshes accessToken if not there', () => {
            let expectedAccessToken = 'refreshedAccessToken';
            fetcher.options.accessToken = expectedAccessToken;

            return fetcher.getAccessToken()
                .then((actualAccessToken) => {
                    expect(actualAccessToken).toEqual(expectedAccessToken);
                });
        });
    });

});
