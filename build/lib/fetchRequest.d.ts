/// <reference types="bluebird" />
import { RequestOptions } from './requestOptions';
import Promise = require('bluebird');
export declare function fetchJSON(requestURL: string, requestOptions: RequestOptions): Promise<any>;
