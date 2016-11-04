/// <reference types="bluebird" />
import { FetchOptions } from './fetchOptions';
import Promise = require('bluebird');
export declare function fetchJSON(fetchURL: string, fetchOptions: FetchOptions): Promise<any>;
