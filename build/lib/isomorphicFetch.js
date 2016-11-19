"use strict";
if (global.fetch !== undefined) {
    console.log('Using node-fetch as fetch is not globally defined');
    fetch = require('node-fetch');
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetch;
//# sourceMappingURL=isomorphicFetch.js.map