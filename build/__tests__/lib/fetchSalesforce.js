"use strict";
var sinon = require('sinon');
var fetcher_1 = require('../../lib/fetcher');
var fetchSObject_1 = require('../../lib/fetchSObject');
var fetchQuery_1 = require('../../lib/fetchQuery');
var fetchChatter_1 = require('../../lib/fetchChatter');
var fetchApexREST_1 = require('../../lib/fetchApexREST');
var fetchSalesforce_1 = require('../../lib/fetchSalesforce');
var SalesforceOptions_1 = require('./SalesforceOptions');
describe('fetchSalesforce', function () {
    var fetcherCreateSpy;
    var fetchSObjectCreateSpy;
    var fetchQueryCreateSpy;
    var fetchChatterCreateSpy;
    var fetchApexRestCreateSpy;
    beforeEach(function () {
        fetcherCreateSpy = sinon.spy(fetcher_1.Fetcher, 'Create');
        fetchSObjectCreateSpy = sinon.spy(fetchSObject_1.FetchSObject, 'Create');
        fetchQueryCreateSpy = sinon.spy(fetchQuery_1.FetchQuery, 'Create');
        fetchChatterCreateSpy = sinon.spy(fetchChatter_1.FetchChatter, 'Create');
        fetchApexRestCreateSpy = sinon.spy(fetchApexREST_1.FetchApexREST, 'Create');
    });
    afterEach(function () {
        fetcherCreateSpy.restore();
        fetchSObjectCreateSpy.restore();
        fetchQueryCreateSpy.restore();
        fetchChatterCreateSpy.restore();
        fetchApexRestCreateSpy.restore();
    });
    describe('withRequiredOptions', function () {
        var testOptions;
        var fetchSalesforce;
        beforeEach(function () {
            testOptions = SalesforceOptions_1.withRequiredSalesforceOptions();
            fetchSalesforce = new fetchSalesforce_1.FetchSalesforce(testOptions);
        });
        it('sets options withDefaults', function () {
            expect(fetchSalesforce.options.apiVersion).toBe(33);
            expect(fetchSalesforce.options.baseURL).toBe('https://baseurl/test/');
        });
        it('creates each fetcher', function () {
            expect(fetcherCreateSpy.calledOnce).toBe(true);
            expect(fetchSObjectCreateSpy.calledOnce).toBe(true);
            expect(fetchQueryCreateSpy.calledOnce).toBe(true);
            expect(fetchChatterCreateSpy.calledOnce).toBe(true);
            expect(fetchApexRestCreateSpy.calledOnce).toBe(true);
            expect(fetchSalesforce.fetcher).toBeInstanceOf(fetcher_1.Fetcher);
            expect(fetchSalesforce.fetchSObject).toBeInstanceOf(fetchSObject_1.FetchSObject);
            expect(fetchSalesforce.fetchApexREST).toBeInstanceOf(fetchApexREST_1.FetchApexREST);
            expect(fetchSalesforce.fetchChatter).toBeInstanceOf(fetchChatter_1.FetchChatter);
            expect(fetchSalesforce.fetchQuery).toBeInstanceOf(fetchQuery_1.FetchQuery);
        });
        it('builds authorization url', function () {
            var authorizationURL = fetchSalesforce.buildAuthorizationURL({
                scope: 'testscope',
                state: 'testState'
            });
            expect(authorizationURL).toBe('https://baseurl/test/services/oauth2/authorize?response_type=code&client_id=testclientid&redirect_uri=&scope=testscope&state=testState');
        });
    });
});
//# sourceMappingURL=fetchSalesforce.js.map