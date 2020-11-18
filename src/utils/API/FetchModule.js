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
    get({
        url = '/',
        body = null,
        credentials = 'include',
        headers = {},
    } = {}
    ) {
        return this._fetch({method: 'GET', url, body, credentials, headers});
    }

    /**
     * Fetch post methos.
     * @param {*} - list with url, body, credentials.
     * @return {promise}
     */
    post({
        url = '/',
        body = null,
        credentials = 'include',
        headers = {},
    } = {}
    ) {
        return this._fetch({method: 'POST', url, body, credentials, headers});
    }

    /**
     * Fetch delete methos.
     * @param {*} - list with url, body, credentials.
     * @return {promise}
     */
    delete({
        url = '/',
        body = null,
        credentials = 'include',
        headers = {},
    } = {}
    ) {
        return this._fetch({method: 'DELETE', url, body, credentials, headers});
    }

    /**
     * Fetch put methos.
     * @param {*} - list with url, body, credentials.
     * @return {promise}
     */
    put({
        url = '/',
        body = null,
        credentials = 'include',
        headers = {},
    } = {}
    ) {
        return this._fetch({method: 'PUT', url, body, credentials, headers});
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
        return fetch(url, {method, body, credentials, headers, mode})
        .then((response) => {
            switch (response.status) {
                case 403:
                  alert('У вас недостаточно прав для выполнения действий! Вы беде перенаправлены на предыдущую страницу');
                  window.history.back();
                  break;
                case 500:
                  alert('Кажется...беку плохо! Повторите свои действия позже');
                  break;
                default:
              }
            return response;
        });
    }
    
    /**
     * checkStatus
     * @param {*} response 
     * @param {*} history 
     */
    checkStatus(response, history) {
        if (response.status === 200) {
            console.log('...');
        }
    }
}

export default new FetchModule();
