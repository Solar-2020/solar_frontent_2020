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

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = {
            'login': email,
            'password': password,
        };

        if (!form.login.trim() || !form.password.trim()) {
            setMainError('Заполните пустые поля!');
            return;
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
                    // console.log(responseBody);

                    if (responseBody.error) {
                        setMainError(responseBody.error);
                    }
                    if (responseBody.login) {
                        history.push('/');
                    }
                });
    };

    return (
        <div className="login-view-container">
            <div className="login-view-container-card">
                <div></div>
                <div className="login-view-container-card__title">Авторизация аккаунта</div>
                {mainError && (
                    <div className="login-view-input-error-text">{mainError}</div>
                )}
                <form className="login-view-container-card__form">
                    <div className="login-view-container-card__input-block-title">Электронная почта</div>
                    <input
                        className="login-view-block-input"
                        onChange={e => changeField('email', e.target.value)}
                        placeholder="Электронная почта"/>

                    <div className="login-view-container-card__input-block-title">Пароль</div>
                    <input
                        onChange={e => changeField('password', e.target.value)}
                        type="password"
                        className="login-view-block-input"placeholder="Введите пароль"/>
                    
                    <a className="login-view-container-card__yandex" href={`${oauth.url}${oauth.id}`}></a>

                <button
                    type="submit"
                    onClick={e => handleSubmit(e)}
                    className="login-view-card-button login-view-card-button_margin">Авторизоваться</button>
                </form>
                <Link to="/registration" className="login-view-link">Ещё нет аккаунта? Создайте!</Link>
            </div>
        </div>
    )
}

export default LoginView;
