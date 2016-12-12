import sinon = require('sinon');
import { withRequiredSalesforceOptions } from './salesforceOptions';
import fetchMock = require('fetch-mock');

import { Fetcher } from '../../lib/fetcher';
import { SalesforceOptions } from '../../lib/salesforceOptions';


let refreshAccessTokenResponse = {
    json: () =>  {
        return {
            access_token: 'refreshedAccessToken'
        };
    }
}
describe('fetcher', () => {
    let options: SalesforceOptions;
    let fetcher: Fetcher;

    beforeEach(() => {
        options = withRequiredSalesforceOptions();
        fetchMock.mock('https://instanceURL/requiredtest/services/oauth2/token', refreshAccessTokenResponse);
    });

    afterEach(() => {
        fetchMock.restore();
    });

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

    describe('fetchJSON', () => {
        let fetchJSONValidResponse = {
            json: () =>  {
                return {
                    allGood: true
                };
            }
        }
        let validRequestURL = 'https://validURL/testPath/toRequest';
        let validRequestOptions = {
            headers: {
                'Authorization': 'Bearer authorizedToken',
                'Content-Type': 'application/json'
            },
            method: 'PATCH'
        }


        beforeEach(() => {
            fetcher = Fetcher.Create(options);
            fetcher.options.accessToken = 'authorizedToken';

            fetchMock.mock('https://validURL/testPath/toRequest', { allGood: true }, { name: 'validRequest' });
        });

        afterEach(() => {
        });

        it('requestOptions has authorizationHeaders', () => {
            let requestURL = validRequestURL;
            let existingOptions = {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH'
            }
           

            return fetcher.fetchJSON(requestURL, existingOptions)
                .then((parsedResonse) => {
                    expect(parsedResonse.allGood).toBeTruthy();
                    expect(fetchMock.called('validRequest')).toBeTruthy();
                });
        });
    });

});