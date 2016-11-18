"use strict";
var sinon = require('sinon');
var Promise = require('bluebird');
var fetcher_1 = require('../../lib/fetcher');
var fetchChatter_1 = require('../../lib/fetchChatter');
var SalesforceOptions_1 = require('./SalesforceOptions');
describe('fetchChatter', function () {
    var fetcher;
    var options;
    var fetchChatter;
    var fetchJSONStub;
    describe('withValidSalesforceOptions', function () {
        beforeEach(function () {
            options = SalesforceOptions_1.withValidSalesforceOptions();
            fetcher = fetcher_1.Fetcher.Create(options);
            fetchChatter = fetchChatter_1.FetchChatter.Create(fetcher, options);
            fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
                .returns(Promise.resolve('success'));
        });
        afterEach(function () {
            fetchJSONStub.restore();
        });
        describe('constructor', function () {
            it('sets fetcher and options', function () {
                expect(fetchChatter.fetcher).toBe(fetcher);
                expect(fetchChatter.options).toBe(options);
            });
            it('sets baseChatterURL', function () {
                expect(options.baseURL).toBe('https://baseurl/test/');
                expect(options.apiVersion).toBe(37);
                expect(options.sfdcCommunityID).toBe('avalidcommunityid');
                expect(fetchChatter.baseChatterURL).toBe('https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter');
            });
        });
        describe('list', function () {
            it('calls fetchJSON', function () {
                var expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                var expectedOptions = { method: 'GET', cache: false };
                return fetchChatter.list()
                    .then(function (result) {
                    expect(result).toBe('success');
                    expect(fetchJSONStub.calledOnce).toBeTruthy();
                    expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                    expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                });
            });
        });
        describe('post', function () {
            it('calls fetchJSON', function () {
                var chatterPost = { aNumber: 5, aString: 'teststring' };
                var expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                var expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"aNumber":5,"aString":"teststring"}'
                };
                return fetchChatter.post(chatterPost)
                    .then(function (result) {
                    expect(result).toBe('success');
                    expect(fetchJSONStub.calledOnce).toBeTruthy();
                    expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                    expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                });
            });
        });
    });
    describe('without a valid SFDC Community ID', function () {
        beforeEach(function () {
            options = SalesforceOptions_1.withValidSalesforceOptions();
            options.sfdcCommunityID = undefined;
            fetcher = fetcher_1.Fetcher.Create(options);
            fetchChatter = fetchChatter_1.FetchChatter.Create(fetcher, options);
            fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
                .returns(Promise.resolve('success'));
        });
        afterEach(function () {
            fetchJSONStub.restore();
        });
        describe('constructor', function () {
            it('sets fetcher and options', function () {
                expect(fetchChatter.fetcher).toBe(fetcher);
                expect(fetchChatter.options).toBe(options);
            });
            it('sets baseChatterURL', function () {
                expect(options.baseURL).toBe('https://baseurl/test/');
                expect(options.apiVersion).toBe(37);
                expect(options.sfdcCommunityID).toBe(undefined);
                expect(fetchChatter.baseChatterURL).toBe('https://baseurl/test/services/data/v37.0/connect/communities/chatter');
            });
        });
        describe('list', function () {
            it('calls fetchJSON', function () {
                var expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feeds/news/me/feed-elements';
                var expectedOptions = { method: 'GET', cache: false };
                try {
                    return fetchChatter.list()
                        .then(fail);
                }
                catch (reason) {
                    expect(reason).toBe('SFDC Community ID is required to fetch Chatter');
                }
            });
        });
        describe('post', function () {
            it('calls fetchJSON', function () {
                var chatterPost = { aNumber: 5, aString: 'teststring' };
                var expectedURL = 'https://baseurl/test/services/data/v37.0/connect/communities/avalidcommunityid/chatter/feed-elements';
                var expectedOptions = {
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