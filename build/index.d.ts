export declare class FetchSalesforce {
    baseURL: string;
    clientID: string;
    refreshToken: string;
    accessToken: string;
    constructor(baseURL: string, clientID: string, refreshToken: string);
    refreshAccessToken(): Promise<any>;
    getAccounts(): Promise<any>;
    query(soqlQuery: string): Promise<any>;
    post(sobjectName: string, body: any): Promise<any>;
    patch(sobjectName: string, id: string, body: any): Promise<any>;
}
