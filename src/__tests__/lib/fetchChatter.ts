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

        describe('retrieve', () => {
            it('calls fetchJSON', () => {
                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                let expectedOptions = { method: 'GET', cache: 'no-cache' };

                return fetchChatter.retrieve('feeds/news/me/feed-elements')
                    .then((result) => {
                        expect(result).toBe('success');

                        expect(fetchJSONStub.calledOnce).toBeTruthy();
                        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                    });
            });
        });

        describe('create', () => {
            it('calls fetchJSON', () => {
                let chatterPost = { aNumber: 5, aString: 'teststring' };

                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"aNumber":5,"aString":"teststring"}'
                }; 

                return fetchChatter.create('feed-elements', chatterPost)
                    .then((result) => {
                        expect(result).toBe('success');

                        expect(fetchJSONStub.calledOnce).toBeTruthy();
                        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                    });
            });
        });

        describe('update', () => {
            it('calls fetchJSON', () => {
                let id: string =  '1092310298';
                let chatterPost = { aNumber: 5, aString: 'teststring' };

                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements/1092310298';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                    body: '{"aNumber":5,"aString":"teststring"}'
                }; 

                return fetchChatter.update('feed-elements', id, chatterPost)
                    .then((result) => {
                        expect(result).toBe('success');

                        expect(fetchJSONStub.calledOnce).toBeTruthy();
                        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                    });
            });
        });

        describe('delete', () => {
            it('calls fetchJSON', () => {
                let chatterPostId: string = '12091029';

                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements/some/url/12091029';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'DELETE'
                };

                return fetchChatter.delete('feed-elements/some/url', chatterPostId)
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

        describe('retrieve', () => {
            it('calls fetchJSON', () => {
                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                let expectedOptions = { method: 'GET', cache: 'no-cache' };

                expect(() => fetchChatter.retrieve('feeds/news/me/feed-elements'))
                    .toThrowError('SFDC Community ID is required to fetch Chatter');
            });
        });

        describe('create', () => {
            it('calls fetchJSON', () => {
                let chatterPost = { aNumber: 5, aString: 'teststring' };

                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"aNumber":5,"aString":"teststring"}'
                };

                expect(() => fetchChatter.create('feed-elements', chatterPost))
                    .toThrowError('SFDC Community ID is required to fetch Chatter');
            });
        });
    });
});