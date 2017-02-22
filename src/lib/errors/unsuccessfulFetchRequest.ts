class UnsuccessfulFetchRequest extends Error {
    requestURL: string;
    requestOptions: RequestInit;
    response: any;

    constructor(message: string, requestURL: string, requestOptions: RequestInit, response: any){
        super(`${message}:\n\trequestURL: ${requestURL}\n\trequestOptions: ${requestOptions}\n\tresponse: ${response}`);
        this.requestURL = requestURL;
        this.requestOptions = requestOptions;
        this.response = response;
    }
}

export default UnsuccessfulFetchRequest;