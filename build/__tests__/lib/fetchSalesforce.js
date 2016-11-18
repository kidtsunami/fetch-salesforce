"use strict";
const sinon = require('sinon');
const fetcher_1 = require('../../lib/fetcher');
const fetchSObject_1 = require('../../lib/fetchSObject');
const fetchQuery_1 = require('../../lib/fetchQuery');
const fetchChatter_1 = require('../../lib/fetchChatter');
const fetchApexREST_1 = require('../../lib/fetchApexREST');
const fetchSalesforce_1 = require('../../lib/fetchSalesforce');
const SalesforceOptions_1 = require('./SalesforceOptions');
describe('fetchSalesforce', () => {
    let fetcherCreateSpy;
    let fetchSObjectCreateSpy;
    let fetchQueryCreateSpy;
    let fetchChatterCreateSpy;
    let fetchApexRestCreateSpy;
    beforeEach(() => {
        fetcherCreateSpy = sinon.spy(fetcher_1.Fetcher, 'Create');
        fetchSObjectCreateSpy = sinon.spy(fetchSObject_1.FetchSObject, 'Create');
        fetchQueryCreateSpy = sinon.spy(fetchQuery_1.FetchQuery, 'Create');
        fetchChatterCreateSpy = sinon.spy(fetchChatter_1.FetchChatter, 'Create');
        fetchApexRestCreateSpy = sinon.spy(fetchApexREST_1.FetchApexREST, 'Create');
    });
    afterEach(() => {
        fetcherCreateSpy.restore();
        fetchSObjectCreateSpy.restore();
        fetchQueryCreateSpy.restore();
        fetchChatterCreateSpy.restore();
        fetchApexRestCreateSpy.restore();
    });
    describe('withRequiredOptions', () => {
        let testOptions;
        let fetchSalesforce;
        beforeEach(() => {
            testOptions = SalesforceOptions_1.withRequiredSalesforceOptions();
            fetchSalesforce = new fetchSalesforce_1.FetchSalesforce(testOptions);
        });
        it('sets options withDefaults', () => {
            expect(fetchSalesforce.options.apiVersion).toBe(33);
            expect(fetchSalesforce.options.baseURL).toBe('https://baseurl/requiredtest/');
        });
        it('creates each fetcher', () => {
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
        it('builds authorization url', () => {
            let authorizationURL = fetchSalesforce.buildAuthorizationURL({
                scope: 'testscope',
                state: 'testState'
            });
            expect(authorizationURL).toBe('https://baseurl/requiredtest/services/oauth2/authorize?response_type=token&client_id=testclientid&redirect_uri=&scope=testscope&state=testState');
        });
    });
});
//# sourceMappingURL=fetchSalesforce.js.map