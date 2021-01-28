import React, { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS, errToastConfig} from '../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Login view
 */
function LoginYandex() {
    const history = useHistory();
    const location = useLocation();

    useEffect(
        () => {
            if (location.hash.includes('access_token')) {
                // console.log(getAccess(location.hash));
                handleSubmit(getAccess(location.hash));
            }
        }, [location]);

    const handleSubmit = (token) => {
        fetchModule.post({
                url: BACKEND_ADDRESS + `/api/auth/yandex/${token}`,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (response.ok) {
                        history.push('/');
                    } else {
                        createErrorToast('Что-то пошло не поплану, вернитесь на авторизацию!');
                    }
                });
    };

    const getAccess = (hash) => {
        return hash.match(/access_token=([^&]*)&/i)[1];
    }

    const createErrorToast = (text) => {
        toast(text, errToastConfig);            
    };

    return (
        <ToastContainer/>
    )
}

export default LoginYandex;
