import React, { useReducer, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Login view
 */
function LoginYandex() {
    const history = useHistory();
    const location = useLocation();

    useEffect(
        () => {
            console.log(location);

            if (location.hash.includes('access_token')) {
                console.log(getAccess(location.hash));
                handleSubmit(getAccess(location.hash));
            }
        }, [location]);

    function handleSubmit(token) {
        fetchModule.post({
                url: BACKEND_ADDRESS + `/api/auth/yandex/${token}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((responseBody) => {
                    console.log(responseBody);

                    if (responseBody.error) {
                        // Сказать об ошибке
                    }
                    if (responseBody.login) {
                        history.push('/');
                    }
                });
    };

    function getAccess(hash) {
        return hash.match(/access_token=([^&]*)&/i)[1];
    }

    return (
        <div>Yandex oauth</div>
    )
}

export default LoginYandex;
