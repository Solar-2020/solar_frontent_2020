import React, { useReducer } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './RegistrationView.css';
import '../LoginView/LoginView.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Login view
 */
function RegistrationView() {
    const history = useHistory();

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    const setMainError = (message) => {
        dispatch({type: 'SET_MAIN_ERROR', message});
    };

    const errorMap = {
        userNameError: 'Заполните имя и фамилию. Допустимы символы: a-z, A-Z, а-я, А-Я, -',
        emailError: 'Валидный формат: email@mail.ru',
        passwordError: 'Длина больше 6 символов, без пробелов',
        passwordScError: 'Пароли должны совпадать',
    };

    const errorStyle = {
        'true': 'login-view-input-block-input-error',
        'false': 'login-view-block-input',
    };

    const regExpr = {
        'FIO': /^[a-zA-Zа-яА-Я]+([\s-]?[a-zA-Zа-яА-Я]+)*$/,
        'email': /^[^\s]+@[^\s]+\.[^\s]+$/,
        'password': /^[^\s]{6,}$/
    };

    const initialState ={
        name: '',
        surname: '',
        email: '',
        password: '',
        passwordSc: '',
        mainError: '',
        userNameError: false,
        emailError: false,
        passwordError: false,
        passwordScError: false,
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
        name,
        surname,
        email,
        password,
        passwordSc,
        mainError,
        userNameError,
        emailError,
        passwordError,
        passwordScError,
    } = state;

    const checkValidationForm = () => {
        let flag = true;

        if (!regExpr.FIO.test(name) || !regExpr.FIO.test(surname)) {
            changeField('userNameError', true);
            flag = false;
        } else {
            changeField('userNameError', false);
        }

        if (!regExpr.email.test(email)) {
            changeField('emailError', true);
            flag = false;
        } else {
            changeField('emailError', false);
        }

        if (!regExpr.password.test(password)) {
            changeField('passwordError', true);
            flag = false;
        } else {
            changeField('passwordError', false);
        }

        if (password !== passwordSc) {
            changeField('passwordScError', true);
            flag = false;
        } else {
            changeField('passwordScError', false);
        }

        return flag;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = {
            'login': email,
            'password': password,
            'avatar': '',
            'name': name,
            'surname': surname,
        };

        if (checkValidationForm()) {
            // console.log(form);

            fetchModule.post({
                url: BACKEND_ADDRESS + `/api/auth/signup`,
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
                        // alert('успешная регистрация!');
                        history.push('/');
                    }
                });
        }
    };

    const validationField = (key, value) => {
        changeField(key, value);

        switch(key) {
            case 'surname':
                if (!regExpr.FIO.test(name) || !regExpr.FIO.test(value)) {
                    changeField('userNameError', true);
                } else {
                    changeField('userNameError', false);
                }
                break;
            case 'name':
                if (!regExpr.FIO.test(value) || !regExpr.FIO.test(surname)) {
                    changeField('userNameError', true);
                } else {
                    changeField('userNameError', false);
                }
                break;
            case 'email':
                if (!regExpr.email.test(value)) {
                    changeField('emailError', true);
                } else {
                    changeField('emailError', false);
                }
                break;
            case 'password':
                if (!regExpr.password.test(value)) {
                    changeField('passwordError', true);
                } else {
                    changeField('passwordError', false);
                }
                break;
            case 'passwordSc':
                if (password !== value) {
                    changeField('passwordScError', true);
                } else {
                    changeField('passwordScError', false);
                }
                break;
            default:
                break;
        };
    }

    return (
        <div className="login-view-container">
            <div className="login-view-container-card">
                <div></div>
                <div className="login-view-container-card__title">Регистрация аккаунта</div>
                {mainError && (
                    <div className="login-view-input-error-text">{mainError}</div>
                )}

                <div className="login-view-container-card__input-block-title">Данные пользователя</div>
                {userNameError && (
                    <div className="reginstration-view-input_error">{errorMap.userNameError}</div>
                )}
                <input
                    className={errorStyle[userNameError]}
                    onChange={e => validationField('name', e.target.value)}
                    placeholder="Имя"/>
                <input
                    className={`${errorStyle[userNameError]} reginstration-view_input-margin`}
                    onChange={e => validationField('surname', e.target.value)}
                    placeholder="Фамилия"/>
                
                <div className="login-view-container-card__input-block-title">Электронная почта</div>
                {emailError && (
                    <div className="reginstration-view-input_error">{errorMap.emailError}</div>
                )}
                <input
                    className={errorStyle[emailError]}
                    onChange={e => validationField('email', e.target.value)}
                    placeholder="Электронная почта"/>

                
                <div className="login-view-container-card__input-block-title">Пароль</div>
                {passwordError && (
                    <div className="reginstration-view-input_error">{errorMap.passwordError}</div>
                )}
                {passwordScError && (
                    <div className="reginstration-view-input_error">{errorMap.passwordScError}</div>
                )}
                <input
                    type="password"
                    onChange={e => validationField('password', e.target.value)}
                    className={(!passwordScError) ? errorStyle[passwordError] : errorStyle[passwordScError]}
                    placeholder="Введите пароль"/>
                <input
                    type="password"
                    onChange={e => validationField('passwordSc', e.target.value)}
                    className={`${errorStyle[passwordScError]} reginstration-view_input-margin`}
                    placeholder="Повторите пароль"/>
                
                <button
                    onClick={e => handleSubmit(e)}
                    className="login-view-card-button">Зарегистрироваться</button>
                <Link to="/login" className="login-view-link">Уже есть аккаунт? Войдите!</Link>

            </div>
        </div>
    )
}

export default RegistrationView;
