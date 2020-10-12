import {CORS_CONST} from '../Config/Config.js';

/** Class create fetch. */
class FetchModule {

    /**
     * Router constructor.
     * @constructor
     */
    constructor() {}

    /**
     * Fetch get method.
     * @param {*} - list with url, body, credentials.
     * @return {promise}
     */
    Get({
        url = '/',
        body = null,
        credentials = 'include',
    } = {}
    ) {
        return this._fetch({method: 'GET', url, body, credentials});
    }

    /**
     * Fetch post methos.
     * @param {*} - list with url, body, credentials.
     * @return {promise}
     */
    Post({
        url = '/',
        body = null,
        credentials = 'include',
        headers = {},
    } = {}
    ) {
        return this._fetch({method: 'POST', url, body, credentials, headers});
    }

    /**
     * Method create fetch.
     * @param {*} - list with method, url, body, credentials.
     * @return {promise} - response.
     */
    _fetch({
        method = 'GET',
        url = '/',
        body = null,
        credentials = 'include',
        headers = {},
        mode = CORS_CONST,
    } = {}
    ) {
        return fetch(url, {method, body, credentials, headers, mode});
    }
}

export default new FetchModule();
