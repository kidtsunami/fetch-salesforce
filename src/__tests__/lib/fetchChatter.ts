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
        });

        describe('list', () => {
            it('calls fetchJSON', () => {
                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                let expectedOptions = { method: 'GET', cache: false };

                return fetchChatter.list()
                    .then((result) => {
                        expect(result).toBe('success');

                        expect(fetchJSONStub.calledOnce).toBeTruthy();
                        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                    });
            });
        });

        describe('post', () => {
            it('calls fetchJSON', () => {
                let chatterPost = { aNumber: 5, aString: 'teststring' };

                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"aNumber":5,"aString":"teststring"}'
                };

                return fetchChatter.post(chatterPost)
                    .then((result) => {
                        expect(result).toBe('success');

                        expect(fetchJSONStub.calledOnce).toBeTruthy();
                        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
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
        });

        describe('list', () => {
            it('calls fetchJSON', () => {
                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                let expectedOptions = { method: 'GET', cache: false };

                try {
                    return fetchChatter.list()
                        .then(fail);
                } catch(reason){
                    expect(reason).toBe('SFDC Community ID is required to fetch Chatter');
                }
            });
        });

        describe('post', () => {
            it('calls fetchJSON', () => {
                let chatterPost = { aNumber: 5, aString: 'teststring' };

                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"aNumber":5,"aString":"teststring"}'
                };

                try {
                    return fetchChatter.post(chatterPost)
                        .then(fail);
                } catch(reason){
                    expect(reason).toBe('SFDC Community ID is required to fetch Chatter');
                }
            });
        });
    });
});