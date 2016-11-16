import { Fetcher } from './fetcher';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchSObject {
    fetcher: Fetcher;
    baseDataURL: string;
    options: SalesforceOptions;
    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchSObject;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private initializeBaseDataURL();
    insert(sobjectName: string, body: any): Promise<any>;
    private getSObjectUrl(sobjectName);
    update(sobjectName: string, body: any): Promise<any>;
    delete(sobjectName: string, id: string): Promise<any>;
}
