import React, { useReducer } from 'react';
import { Link } from 'react-router-dom';
import './LoginView.css';

/**
 * Login view
 */
function LoginView() {
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
            email,
            password,
        };
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
                    className="login-view-container__card__input-block__input"placeholder="Введите пароль"/>
                
                <button
                    onClick={e => handleSubmit(e)}
                    className="login-view-container__card__button">Авторизоваться</button>
                <Link to="/registration" className="login-view-container__card__link">Ещё нет аккаунта? Создайте!</Link>

            </div>
        </div>
    )
}

export default LoginView;