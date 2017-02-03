class FailedToRevokeAccessToken extends Error {
    constructor(message: string, accessToken: string){
        super(`${message}:\n\taccessToken: ${accessToken}`);
    }
}

export default FailedToRevokeAccessToken;