
declare module "url-join" {
    var urlJoin: any;
    export = urlJoin;
}

declare var fetch: Fetch.fetch;

declare namespace Fetch {
    interface fetch{
        (requestUrl: string, options: any): any;
    }
}