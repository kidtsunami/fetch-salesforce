"use strict";
var sinon = require('sinon');
var Promise = require('bluebird');
var fetcher_1 = require('../../lib/fetcher');
var fetchSObject_1 = require('../../lib/fetchSObject');
var SalesforceOptions_1 = require('./SalesforceOptions');
describe('fetchSObject', function () {
    var fetcher;
    var options;
    var fetchSObject;
    var fetchJSONStub;
    beforeEach(function () {
        options = SalesforceOptions_1.withValidSalesforceOptions();
        fetcher = fetcher_1.Fetcher.Create(options);
        fetchSObject = fetchSObject_1.FetchSObject.Create(fetcher, options);
        fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
            .returns(Promise.resolve('success'));
    });
    afterEach(function () {
        fetchJSONStub.restore();
    });
    describe('constructor', function () {
        it('sets fetcher and options', function () {
            expect(fetchSObject.fetcher).toBe(fetcher);
            expect(fetchSObject.options).toBe(options);
        });
        it('sets baseDataURL', function () {
            expect(options.baseURL).toBe('https://baseurl/test/');
            expect(options.apiVersion).toBe(37);
            expect(fetchSObject.baseDataURL).toBe('https://baseurl/test/services/data/v37.0');
        });
    });
    describe('insert', function () {
        it('calls fetchJSON', function (testDone) {
            var sObjectName = 'Account';
            var sObjectBody = {
                Name: 'test name'
            };
            var expectedURL = 'https://baseurl/test/services/data/v37.0/Account';
            var expectedOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: '{"Name":"test name"}'
            };
            fetchSObject.insert(sObjectName, sObjectBody)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                testDone();
            });
        });
    });
    describe('get', function () {
        var sObjectName;
        var id;
        beforeEach(function () {
            sObjectName = 'Case';
            id = 'a0Ga000000awuHe';
        });
        it('calls fetchJSON', function () {
            var expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
            var expectedOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            };
            return fetchSObject.get(sObjectName, id)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledOnce).toBeTruthy();
                expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
            });
        });
    });
    describe('update', function () {
        var sObjectName;
        var sObjectBody;
        beforeEach(function () {
            sObjectName = 'Case';
            sObjectBody = {
                Name: 'test case name',
                Subject: 'what'
            };
        });
        describe('with id', function () {
            beforeEach(function () {
                sObjectBody.id = 'a0Ga000000awuHe';
            });
            it('calls fetchJSON', function () {
                var expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
                var expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                    body: '{"Name":"test case name","Subject":"what","id":"a0Ga000000awuHe"}'
                };
                return fetchSObject.update(sObjectName, sObjectBody)
                    .then(function (result) {
                    expect(result).toBe('success');
                    expect(fetchJSONStub.calledOnce).toBeTruthy();
                    expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                    expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                });
            });
        });
        describe('without id', function () {
            it('calls fetchJSON and an exception is thrown', function () {
                var expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
                var expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'PATCH',
                    body: '{"Name":"test case name","Subject":"what","id":"a0Ga000000awuHe"}'
                };
                try {
                    fetchSObject.update(sObjectName, sObjectBody)
                        .then(fail);
                }
                catch (reason) {
                    var expectedReason = {
                        error: 'Invalid body for update, missing id',
                        body: sObjectBody
                    };
                    expect(reason).toEqual(expectedReason);
                }
            });
        });
    });
    describe('delete', function () {
        var sObjectName;
        var id;
        beforeEach(function () {
            sObjectName = 'Case';
            id = 'a0Ga000000awuHe';
        });
        it('calls fetchJSON', function () {
            var expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
            var expectedOptions = {
                method: 'DELETE'
            };
            return fetchSObject.delete(sObjectName, id)
                .then(function (result) {
                expect(result).toBe('success');
                expect(fetchJSONStub.calledOnce).toBeTruthy();
                expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
            });
        });
    });
});
//# sourceMappingURL=fetchSObject.js.map