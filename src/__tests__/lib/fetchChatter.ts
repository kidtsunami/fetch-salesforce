import sinon = require('sinon');
import Promise = require('bluebird');
import { Fetcher } from '../../lib/fetcher';
import { FetchChatter } from '../../lib/fetchChatter';

import { SalesforceOptions } from '../../lib/SalesforceOptions';
import { withValidSalesforceOptions } from './SalesforceOptions';

describe('fetchChatter', () => {
    let fetcher: Fetcher;
    let options: SalesforceOptions;
    let fetchChatter: FetchChatter;
    let fetchJSONStub: sinon.SinonStub;

    describe('withValidSalesforceOptions', () => {
        beforeEach(() => {
            options = withValidSalesforceOptions();
            fetcher = Fetcher.Create(options);
            fetchChatter = FetchChatter.Create(fetcher, options);

            fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
                .returns(Promise.resolve('success'));
        });

        afterEach(() => {
            fetchJSONStub.restore();
        });

        describe('constructor', () => {
            it('sets fetcher and options', () => {
                expect(fetchChatter.fetcher).toBe(fetcher);
                expect(fetchChatter.options).toBe(options);
            });

            it('sets baseChatterURL', () => {
                expect(options.baseURL).toBe('https://baseurl/test/');
                expect(options.apiVersion).toBe(37);
                expect(options.sfdcCommunityID).toBe('avalidcommunityid');
                expect(fetchChatter.baseChatterURL).toBe('https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter')
            });
        });

        describe('list', () => {
            it('calls fetchJSON', (testDone) => {
                let expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                let expectedOptions = { method: 'GET', cache: false };

                fetchChatter.list()
                    .then((result) => {
                        expect(result).toBe('success');

                        expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                        testDone();
                    });
            });
        });

        describe('post', () => {
            it('calls fetchJSON', (testDone) => {
                let chatterPost = { aNumber: 5, aString: 'teststring' };

                let expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"aNumber":5,"aString":"teststring"}'
                };

                fetchChatter.post(chatterPost)
                    .then((result) => {
                        expect(result).toBe('success');

                        expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                        testDone();
                    });
            });
        });
    });

    describe('without a valid SFDC Community ID', () => {
        beforeEach(() => {
            options = withValidSalesforceOptions();
            options.sfdcCommunityID = undefined;
            fetcher = Fetcher.Create(options);
            fetchChatter = FetchChatter.Create(fetcher, options);

            fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
                .returns(Promise.resolve('success'));
        });

        afterEach(() => {
            fetchJSONStub.restore();
        });

        describe('constructor', () => {
            it('sets fetcher and options', () => {
                expect(fetchChatter.fetcher).toBe(fetcher);
                expect(fetchChatter.options).toBe(options);
            });

            it('sets baseChatterURL', () => {
                expect(options.baseURL).toBe('https://baseurl/test/');
                expect(options.apiVersion).toBe(37);
                expect(options.sfdcCommunityID).toBe(undefined);
                expect(fetchChatter.baseChatterURL).toBe('https://baseurl/test/services/data/v37.0/connect/communities/chatter')
            });
        });

        describe('list', () => {
            it('calls fetchJSON', () => {
                let expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                let expectedOptions = { method: 'GET', cache: false };

                try {
                    fetchChatter.list()
                        .then(fail);
                    fail();
                } catch(reason){
                    expect(reason).toBe('SFDC Community ID is required to fetch Chatter');
                }
            });
        });

        describe('post', () => {
            it('calls fetchJSON', () => {
                let chatterPost = { aNumber: 5, aString: 'teststring' };

                let expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"aNumber":5,"aString":"teststring"}'
                };

                try {
                    fetchChatter.post(chatterPost)
                        .then(fail);
                    fail();
                } catch(reason){
                    expect(reason).toBe('SFDC Community ID is required to fetch Chatter');
                }
            });
        });
    });
});