import sinon = require('sinon');
import { withRequiredSalesforceOptions } from './salesforceOptions';
import fetchMock = require('fetch-mock');
import Promise = require('bluebird');

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
        let valid204RequestURL = 'https://validURL/testPath/toRequesta204';
        let validRequestWithHeaders = 'validRequestWithHeaders';
        let validRequestWithNoExistingHeaders = 'validRequestWithNoExistingHeaders';
        let validRequestWith204Response = 'validRequestWithNoExistingHeaders';

        beforeEach(() => {
            fetcher = Fetcher.Create(options);
            fetcher.options.accessToken = 'authorizedToken';

            mockValidRequestWithHeaders();
            mockValidRequestWithNoExistingHeaders();
            mockValidRequestWith204Response();
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

        function mockValidRequestWith204Response(){
            let mockOptions = {
                name: validRequestWith204Response,
                headers: {
                    'Authorization': 'Authorization: Bearer authorizedToken'
                },
                method: 'POST'
            }
            let response = {
                status: 204
            };
            fetchMock.mock(valid204RequestURL, response, mockOptions);
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

        it('does not parse a 204', () => {
            let requestURL = valid204RequestURL;
            let existingOptions = {
                method: 'POST'
            }
           
            return fetcher.fetchJSON(requestURL, existingOptions)
                .then((response) => {
                    expect(response.bodyUsed).toBeFalsy();
                    expect(response.status).toBe(204);
                    expect(fetchMock.calls().matched.length).toBe(1);
                    expect(fetchMock.called(validRequestWith204Response)).toBeTruthy();
                });
        });
    });

    describe('revokeAccessToken', () => {
        let validRevokeURL = 'https://instanceURL/requiredtest/services/oauth2/revoke';
        let validRevokeRequest = 'validRevokeRequest';
        let validRevokeBody = 'token=authorizedToken';
        let validRevokeOptions = {
            name: validRevokeRequest,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST'
        }
        let lastEmittedStatus: string;
        describe('with valid response', () => {
            function validateExpectedBody(url, options): any{
                if(options.body == validRevokeBody){
                    return Promise.delay(300).then(() => {
                        return {
                            status: 200
                        }
                    });
                } else {
                    return {
                        throws: `{ options.body } did not equal expect: { options.body }`
                    }
                }
            }

            beforeEach(() => {
                fetcher = Fetcher.Create(options);
                fetcher.options.accessToken = 'authorizedToken';
                fetchMock.mock(validRevokeURL, validateExpectedBody, validRevokeOptions);
                lastEmittedStatus = null;
                fetcher.on('accessTokenRevoking', () => { lastEmittedStatus = 'accessTokenRevoking'; });
                fetcher.on('accessTokenRevoked', () => { lastEmittedStatus = 'accessTokenRevoked'; });
            });

            it('makes valid request', () => {
                return fetcher.revokeAccessToken()
                    .then(() => {
                        expect(fetchMock.calls().matched.length).toBe(1);
                        expect(fetchMock.called(validRevokeRequest)).toBeTruthy();
                    });
            });

            it('emits events', () =>{
                expect(lastEmittedStatus).toBeNull();
                fetcher.revokeAccessToken()
                    .then(() => {
                        expect(lastEmittedStatus).toEqual('accessTokenRevoked');
                    });
                expect(lastEmittedStatus).toEqual('accessTokenRevoking');
            });
        });
            
        describe('with missing accessToken', () => {
            it('throws error', () => {
                fetcher.options.accessToken = null;
                expect(() => fetcher.revokeAccessToken()).toThrowError('No Access Token to Revoke');
            });
        });
        
        describe('with non-200 response', () => {
            beforeEach(() => {
                fetcher = Fetcher.Create(options);
                fetcher.options.accessToken = 'authorizedToken';
                fetchMock.mock(validRevokeURL, { status: 404 }, '404request');
            });

            it('throws error', () => {
                return fetcher.revokeAccessToken()
                    .then(() => {
                        throw 'expected to throw an error'
                    })
                    .catch((caughtError) => {
                        expect(caughtError.requestURL).toEqual(validRevokeURL);
                        expect(caughtError.requestOptions.body).toEqual(validRevokeBody);
                        expect(caughtError.response.status).toBe(404);
                    });
            });
        })
    });
});