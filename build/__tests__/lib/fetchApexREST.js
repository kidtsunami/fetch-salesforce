"use strict";
var sinon = require('sinon');
var Promise = require('bluebird');
var fetcher_1 = require('../../lib/fetcher');
var fetchApexREST_1 = require('../../lib/fetchApexREST');
var SalesforceOptions_1 = require('./SalesforceOptions');
describe('fetchApexREST', function () {
    var fetcher;
    var options;
    var fetchApexREST;
    var fetchJSONStub;
    beforeEach(function () {
        options = SalesforceOptions_1.withRequiredSalesforceOptions();
        fetcher = fetcher_1.Fetcher.Create(options);
        fetchApexREST = fetchApexREST_1.FetchApexREST.Create(fetcher, options);
        fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
            .returns(Promise.resolve('success'));
    });
    afterEach(function () {
        fetchJSONStub.restore();
    });
    describe('constructor', function () {
        it('sets fetcher and options', function () {
            expect(fetchApexREST.fetcher).toBe(fetcher);
            expect(fetchApexREST.options).toBe(options);
        });
        it('sets baseApexRESTURL', function () {
            expect(options.baseURL).toBe('https://baseurl/requiredtest/');
            expect(fetchApexREST.baseApexRESTURL).toBe('https://baseurl/requiredtest/apexrest');
        });
    });
    describe('get', function () {
        it('calls fetchJSON', function (testDone) {
            var endpointPath = 'endpoint/path';
            var expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/path';
            var expectedOptions = { method: 'GET' };
            fetchApexREST.get(endpointPath)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                testDone();
            });
        });
    });
    describe('post', function () {
        it('calls fetchJSON', function () {
            var endpointPath = 'endpoint/postpath';
            var body = { aNumber: 5, aString: 'teststring' };
            var expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/postpath';
            var expectedOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: '{"aNumber":5,"aString":"teststring"}'
            };
            return fetchApexREST.post(endpointPath, body)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledOnce).toBeTruthy();
                expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
            });
        });
    });
    describe('patch', function () {
        it('calls fetchJSON', function () {
            var endpointPath = 'endpoint/patchpath';
            var body = { aNumber: 5, aString: 'teststring' };
            var expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/patchpath';
            var expectedOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'PATCH',
                body: '{"aNumber":5,"aString":"teststring"}'
            };
            return fetchApexREST.patch(endpointPath, body)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledOnce).toBeTruthy();
                expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
            });
        });
    });
    describe('delete', function () {
        it('calls fetchJSON', function () {
            var endpointPath = 'endpoint/deletepath';
            var expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/deletepath';
            var expectedOptions = { method: 'DELETE' };
            return fetchApexREST.delete(endpointPath)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
            });
        });
    });
});
//# sourceMappingURL=fetchApexREST.js.map