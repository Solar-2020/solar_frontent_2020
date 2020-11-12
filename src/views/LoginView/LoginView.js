import React, { useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './LoginView.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Login view
 */
function LoginView() {
    const oauth = {
        id: 'e50242f5de2543598a50fc9a02b2b394',
        url: 'https://oauth.yandex.ru/authorize?response_type=token&client_id=',
    };

    const history = useHistory();

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
        <div className="login-view-container">
            <div className="login-view-container__card">
                <div></div>
                <div className="login-view-container__card__title">Авторизация аккаунта</div>
                {mainError && (
                    <div className="login-view-container__card__input-block__input__error-text">{mainError}</div>
                )}
                <div className="login-view-container__card__input-block__title">Электронная почта</div>
                <input
                    className="login-view-container__card__input-block__input"
                    onChange={e => changeField('email', e.target.value)}
                    placeholder="Электронная почта"/>

                <div className="login-view-container__card__input-block__title">Пароль</div>
                <input
                    onChange={e => changeField('password', e.target.value)}
                    type="password"
                    className="login-view-container__card__input-block__input"placeholder="Введите пароль"/>
                
                <button
                    onClick={e => handleSubmit(e)}
                    className="login-view-container__card__button">Авторизоваться</button>
                <Link to="/registration" className="login-view-container__card__link">Ещё нет аккаунта? Создайте!</Link>
                <a href={`${oauth.url}${oauth.id}`}>яндекс</a>
            </div>
        </div>
    )
}

export default LoginView;
