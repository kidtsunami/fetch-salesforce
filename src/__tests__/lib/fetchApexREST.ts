import sinon = require('sinon');
import Promise = require('bluebird');
import { Fetcher } from '../../lib/fetcher';
import { FetchApexREST } from '../../lib/fetchApexREST';

import { SalesforceOptions } from '../../lib/SalesforceOptions';
import { withRequiredSalesforceOptions } from './SalesforceOptions';

describe('fetchApexREST', () => {
    let fetcher: Fetcher;
    let options: SalesforceOptions;
    let fetchApexREST: FetchApexREST;
    let fetchJSONStub: sinon.SinonStub;

    beforeEach(() => {
        options = withRequiredSalesforceOptions();
        fetcher = Fetcher.Create(options);
        fetchApexREST = FetchApexREST.Create(fetcher, options);

        fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
            .returns(Promise.resolve('success'));
    });

    afterEach(() => {
        fetchJSONStub.restore();
    });

    describe('constructor', () => {
        it('sets fetcher and options', () => {
            expect(fetchApexREST.fetcher).toBe(fetcher);
            expect(fetchApexREST.options).toBe(options);
        });

        it('sets baseApexRESTURL', () => {
            expect(options.baseURL).toBe('https://baseurl/requiredtest/');
            expect(fetchApexREST.baseApexRESTURL).toBe('https://baseurl/requiredtest/apexrest')
        });
    });

    describe('get', () => {
        it('calls fetchJSON', (testDone) => {
            let endpointPath = 'endpoint/path'
            let expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/path'
            let expectedOptions = { method: 'GET' };

            fetchApexREST.get(endpointPath)
                .then((result) => {
                    expect(result).toBe('success');

                    expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                    testDone();
                });
        });
    });

    describe('post', () => {
        it('calls fetchJSON', (testDone) => {
            let endpointPath = 'endpoint/postpath'
            let body = { aNumber: 5, aString: 'teststring' };

            let expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/postpath'
            let expectedOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: '{"aNumber":5,"aString":"teststring"}'
            };

            fetchApexREST.post(endpointPath, body)
                .then((result) => {
                    expect(result).toBe('success');

                    expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                    testDone();
                });
        });
    });

    describe('patch', () => {
        it('calls fetchJSON', (testDone) => {
            let endpointPath = 'endpoint/patchpath'
            let body = { aNumber: 5, aString: 'teststring' };

            let expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/patchpath'
            let expectedOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'PATCH',
                body: '{"aNumber":5,"aString":"teststring"}'
            };

            fetchApexREST.patch(endpointPath, body)
                .then((result) => {
                    expect(result).toBe('success');

                    expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                    testDone();
                });
        });
    });

    describe('delete', () => {
        it('calls fetchJSON', (testDone) => {
            let endpointPath = 'endpoint/deletepath'

            let expectedURL = 'https://baseurl/requiredtest/apexrest/endpoint/deletepath'
            let expectedOptions = { method: 'DELETE' };

            fetchApexREST.delete(endpointPath)
                .then((result) => {
                    expect(result).toBe('success');

                    expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                    testDone();
                });
        });
    });
});