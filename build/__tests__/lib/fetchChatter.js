"use strict";
const sinon = require('sinon');
const Promise = require('bluebird');
const fetcher_1 = require('../../lib/fetcher');
const fetchChatter_1 = require('../../lib/fetchChatter');
const SalesforceOptions_1 = require('./SalesforceOptions');
describe('fetchChatter', () => {
    let fetcher;
    let options;
    let fetchChatter;
    let fetchJSONStub;
    describe('withValidSalesforceOptions', () => {
        beforeEach(() => {
            options = SalesforceOptions_1.withValidSalesforceOptions();
            fetcher = fetcher_1.Fetcher.Create(options);
            fetchChatter = fetchChatter_1.FetchChatter.Create(fetcher, options);
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
                expect(options.instanceURL).toBe('https://instanceURL/test/');
                expect(options.apiVersion).toBe(37);
                expect(options.sfdcCommunityID).toBe('avalidcommunityid');
                expect(fetchChatter.baseChatterURL).toBe('https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter');
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
            options = SalesforceOptions_1.withValidSalesforceOptions();
            options.sfdcCommunityID = undefined;
            fetcher = fetcher_1.Fetcher.Create(options);
            fetchChatter = fetchChatter_1.FetchChatter.Create(fetcher, options);
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
                expect(options.instanceURL).toBe('https://instanceURL/test/');
                expect(options.apiVersion).toBe(37);
                expect(options.sfdcCommunityID).toBe(undefined);
                expect(fetchChatter.baseChatterURL).toBe('https://instanceURL/test/services/data/v37.0/connect/communities/chatter');
            });
        });
        describe('list', () => {
            it('calls fetchJSON', () => {
                let expectedURL = 'https://instanceURL/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                let expectedOptions = { method: 'GET', cache: false };
                try {
                    return fetchChatter.list()
                        .then(fail);
                }
                catch (reason) {
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
                }
                catch (reason) {
                    expect(reason).toBe('SFDC Community ID is required to fetch Chatter');
                }
            });
        });
    });
});
//# sourceMappingURL=fetchChatter.js.map