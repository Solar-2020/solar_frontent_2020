import React, { useReducer, useEffect } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Login view
 */
function LoginYandex() {
    const oauth = {
        id: 'e50242f5de2543598a50fc9a02b2b394',
        url: 'https://oauth.yandex.ru/authorize?response_type=token&client_id=',
    };

    const history = useHistory();
    const location = useLocation();

    useEffect(
        () => {
            console.log(location.pathname);
        }, [location]);

    function changeField(field, value) {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    function setMainError(message) {
        dispatch({type: 'SET_MAIN_ERROR', message});
    };

    const initialState ={
        email: '',
        password: '',
        mainError: '',
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'SET_MAIN_ERROR':
                    return {...state, mainError: action.message};
                case 'CLEAN_FORM':
                    return {...initialState};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        email,
        password,
        mainError,
    } = state;

    function handleSubmit(event) {
        event.preventDefault();

        const form = {
            'login': email,
            'password': password,
        };

        fetchModule.post({
                url: BACKEND_ADDRESS + `/api/auth/login`,
                body: JSON.stringify(form),
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
                        setMainError(responseBody.error);
                    }
                    if (responseBody.login) {
                        // alert('успешная авторизация!');
                        history.push('/');
                    }
                });
    };

    return (
        <div>Yandex oauth</div>
    )
}

export default LoginYandex;
