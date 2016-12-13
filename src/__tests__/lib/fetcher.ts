import sinon = require('sinon');
import { withRequiredSalesforceOptions } from './salesforceOptions';
import fetchMock = require('fetch-mock');

import { Fetcher } from '../../lib/fetcher';
import { SalesforceOptions } from '../../lib/salesforceOptions';

describe('fetcher', () => {
    let options: SalesforceOptions;
    let fetcher: Fetcher;

    beforeEach(() => {
        options = withRequiredSalesforceOptions();
        fetchMock.mock('https://instanceURL/requiredtest/services/oauth2/token', {
            access_token: 'refreshedAccessToken'
        });
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
        let validRequestWithHeaders = 'validRequestWithHeaders';
        let validRequestWithNoExistingHeaders = 'validRequestWithNoExistingHeaders';

        beforeEach(() => {
            fetcher = Fetcher.Create(options);
            fetcher.options.accessToken = 'authorizedToken';

            mockValidRequestWithHeaders();
            mockValidRequestWithNoExistingHeaders();
        });

        function mockValidRequestWithHeaders(){
            let mockOptions = {
                name: validRequestWithHeaders,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Authorization: Bearer authorizedToken'
                },
                method: 'PATCH'
            }
            fetchMock.mock(validRequestURL, {
                    allGood: true
                }, mockOptions);
        }

        function mockValidRequestWithNoExistingHeaders(){
            let mockOptions = {
                name: validRequestWithNoExistingHeaders,
                headers: {
                    'Authorization': 'Authorization: Bearer authorizedToken'
                },
                method: 'POST'
            }
            fetchMock.mock(validRequestURL, {
                    allGoodWithNoExisting: true
                }, mockOptions);
        }

        afterEach(() => {
        });

        it('requestOptions adds authorizationHeaders for existing headers', () => {
            let requestURL = validRequestURL;
            let existingOptions = {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'PATCH'
            };
           

            return fetcher.fetchJSON(requestURL, existingOptions)
                .then((parsedResonse) => {
                    expect(parsedResonse.allGood).toBeTruthy();
                    expect(fetchMock.called(validRequestWithHeaders)).toBeTruthy();
                    expect(fetchMock.called(validRequestWithNoExistingHeaders)).toBeFalsy();
                });
        });

        it('requestOptions adds authorizationHeaders for no headers', () => {
            let requestURL = validRequestURL;
            let existingOptions = {
                method: 'POST'
            }
           
            return fetcher.fetchJSON(requestURL, existingOptions)
                .then((parsedResonse) => {
                    expect(parsedResonse.allGoodWithNoExisting).toBeTruthy();
                    expect(fetchMock.called(validRequestWithNoExistingHeaders)).toBeTruthy();
                    expect(fetchMock.called(validRequestWithHeaders)).toBeFalsy();
                });
        });
    });

});