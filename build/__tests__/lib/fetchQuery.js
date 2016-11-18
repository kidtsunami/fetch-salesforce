"use strict";
var sinon = require('sinon');
var Promise = require('bluebird');
var fetcher_1 = require('../../lib/fetcher');
var fetchQuery_1 = require('../../lib/fetchQuery');
var SalesforceOptions_1 = require('./SalesforceOptions');
describe('fetchQuery', function () {
    var fetcher;
    var options;
    var fetchQuery;
    var fetchJSONStub;
    beforeEach(function () {
        options = SalesforceOptions_1.withValidSalesforceOptions();
        fetcher = fetcher_1.Fetcher.Create(options);
        fetchQuery = fetchQuery_1.FetchQuery.Create(fetcher, options);
        fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
            .returns(Promise.resolve('success'));
    });
    afterEach(function () {
        fetchJSONStub.restore();
    });
    describe('constructor', function () {
        it('sets fetcher and options', function () {
            expect(fetchQuery.fetcher).toBe(fetcher);
            expect(fetchQuery.options).toBe(options);
        });
        it('sets baseDataURL', function () {
            expect(options.baseURL).toBe('https://baseurl/test/');
            expect(options.apiVersion).toBe(37);
            expect(fetchQuery.baseDataURL).toBe('https://baseurl/test/services/data/v37.0');
        });
    });
    describe('query', function () {
        it('calls fetchJSON', function () {
            var soqlQuery = 'SELECT Id, Name FROM Account';
            var expectedURL = 'https://baseurl/test/services/data/v37.0/query?q=SELECT%20Id%2C%20Name%20FROM%20Account';
            var expectedOptions = { method: 'GET', cache: false };
            return fetchQuery.query(soqlQuery)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledOnce).toBeTruthy();
                expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
            });
        });
    });
});
//# sourceMappingURL=fetchQuery.js.map