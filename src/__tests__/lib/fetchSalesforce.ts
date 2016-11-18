import sinon = require('sinon');
import { Fetcher } from '../../lib/fetcher';
import { FetchSObject } from '../../lib/fetchSObject';
import { FetchQuery } from '../../lib/fetchQuery';
import { FetchChatter } from '../../lib/fetchChatter';
import { FetchApexREST } from '../../lib/fetchApexREST';

import { FetchSalesforce } from '../../lib/fetchSalesforce';
import { SalesforceOptions } from '../../lib/SalesforceOptions';
import { withRequiredSalesforceOptions } from './SalesforceOptions';

describe('fetchSalesforce', () => {
    let fetcherCreateSpy: Sinon.SinonSpy;
    let fetchSObjectCreateSpy: Sinon.SinonSpy;
    let fetchQueryCreateSpy: Sinon.SinonSpy;
    let fetchChatterCreateSpy: Sinon.SinonSpy;
    let fetchApexRestCreateSpy: Sinon.SinonSpy;

    beforeEach(() => {
        fetcherCreateSpy = sinon.spy(Fetcher, 'Create');
        fetchSObjectCreateSpy = sinon.spy(FetchSObject, 'Create');
        fetchQueryCreateSpy = sinon.spy(FetchQuery, 'Create');
        fetchChatterCreateSpy = sinon.spy(FetchChatter, 'Create');
        fetchApexRestCreateSpy = sinon.spy(FetchApexREST, 'Create');
    });

    afterEach(() => {
        fetcherCreateSpy.restore();
        fetchSObjectCreateSpy.restore();
        fetchQueryCreateSpy.restore();
        fetchChatterCreateSpy.restore();
        fetchApexRestCreateSpy.restore();
    });

    describe('withRequiredOptions', () => {
        let testOptions: SalesforceOptions;
        let fetchSalesforce: FetchSalesforce;
        beforeEach(() => {
            testOptions = withRequiredSalesforceOptions();
            fetchSalesforce = new FetchSalesforce(testOptions);
        });

        it('sets options withDefaults', () => {
            expect(fetchSalesforce.options.apiVersion).toBe(33);
            expect(fetchSalesforce.options.instanceURL).toBe('https://instanceURL/requiredtest/');
        });

        it('creates each fetcher', () => {
            expect(fetcherCreateSpy.calledOnce).toBe(true);
            expect(fetchSObjectCreateSpy.calledOnce).toBe(true);
            expect(fetchQueryCreateSpy.calledOnce).toBe(true);
            expect(fetchChatterCreateSpy.calledOnce).toBe(true);
            expect(fetchApexRestCreateSpy.calledOnce).toBe(true);

            expect(fetchSalesforce.fetcher).toBeInstanceOf(Fetcher);
            expect(fetchSalesforce.fetchSObject).toBeInstanceOf(FetchSObject);
            expect(fetchSalesforce.fetchApexREST).toBeInstanceOf(FetchApexREST);
            expect(fetchSalesforce.fetchChatter).toBeInstanceOf(FetchChatter);
            expect(fetchSalesforce.fetchQuery).toBeInstanceOf(FetchQuery);
        });

        it('builds authorization url', () => {
            let authorizationURL = fetchSalesforce.buildAuthorizationURL({
                scope: 'testscope',
                state: 'testState'
            });

            expect(authorizationURL).toBe('https://instanceURL/requiredtest/services/oauth2/authorize?response_type=token&client_id=testclientid&redirect_uri=&scope=testscope&state=testState');
        });
    });
});
