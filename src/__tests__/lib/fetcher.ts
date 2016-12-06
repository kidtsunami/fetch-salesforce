import { withRequiredSalesforceOptions } from './salesforceOptions';

import { Fetcher } from '../../lib/fetcher';
import { SalesforceOptions } from '../../lib/salesforceOptions';

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

        it('returns accessToken if there', () => {
            let expectedAccessToken = 'existingAccessToken';
            fetcher.options.accessToken = expectedAccessToken;

            return fetcher.getAccessToken()
                .then((actualAccessToken) => {
                    expect(actualAccessToken).toEqual(expectedAccessToken);
                });
        });
    });

});