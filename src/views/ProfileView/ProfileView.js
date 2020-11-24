import React, { useReducer, useEffect } from 'react';
import './ProfileView.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS, okToastConfig, errToastConfig, FILE_SIZE, FILE_STR} from '../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Profile view
 */
function ProfileView({cookies, userData}) {
    // const user = {"id":281,"email":"Ad.shishova@yandex.ru","name":"Анастасия","surname":"Шишова","avatarURL":"61207/enc-bccac8eccfa2ed0b4918b8f64687f983f23d9a96d2eccac2a697ce7cd339719d"};
    const initialState = {
        oldData: userData,
        newData: userData,
        save: false,
        userNameError: false,
        emailError: false,
        mainError: '',
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch(action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'CHANGE_NEW_DATA':
                    return {...state, newData: {...state.newData, [action.field]: action.value}};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        oldData,
        newData,
        save,
        userNameError,
        emailError,
        mainError,
    } = state;

    useEffect(
        () => {
            changeField('oldData', userData);
            changeField('newData', userData);
        }, [userData]);

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    const changeNewData = (field, value) => {
        dispatch({type: 'CHANGE_NEW_DATA', field, value});
    };

    const errorMap = {
        userNameError: 'Заполните имя и фамилию. Допустимы символы: a-z, A-Z, а-я, А-Я, -',
        emailError: 'Валидный формат: email@mail.ru',
        passwordError: 'Длина больше 6 символов, без пробелов',
        passwordScError: 'Пароли должны совпадать',
    };

    const regExpr = {
        'FIO': /^[a-zA-Zа-яА-Я]+([\s-]?[a-zA-Zа-яА-Я]+)*$/,
        'email': /^[^\s]+@[^\s]+\.[^\s]+$/,
        'password': /^[^\s]{6,}$/
    };

    const errorStyle = {
        'true': 'login-view-container__card__input-block__input__error-input',
        'false': 'login-view-container__card__input-block__input',
    };

    const checkNewDatatFields = () => {
        const arr = Object.keys(newData).filter(elem => newData[elem] !== oldData[elem]);
       (arr.length > 0) ? changeField('save', true) : changeField('save', false);
    };

    function validationField(key, value) {
        changeNewData(key, value);

        checkNewDatatFields();
        if (value !== oldData[key]) changeField('save', true);

        switch(key) {
            case 'surname':
                if (!regExpr.FIO.test(newData.name) || !regExpr.FIO.test(value)) {
                    changeField('userNameError', true);
                } else {
                    changeField('userNameError', false);
                }
                break;
            case 'name':
                if (!regExpr.FIO.test(value) || !regExpr.FIO.test(newData.surname)) {
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
            // case 'password':
            //     if (!regExpr.password.test(value)) {
            //         changeField('passwordError', true);
            //     } else {
            //         changeField('passwordError', false);
            //     }
            //     break;
            // case 'passwordSc':
            //     if (password !== value) {
            //         changeField('passwordScError', true);
            //     } else {
            //         changeField('passwordScError', false);
            //     }
            //     break;
            default:
                break;
        };
    };

    const addPhoto = (file) => {
        const formData = new FormData();
        formData.append('body', JSON.stringify({name: file.name}));
        formData.append('file', file);

        if (file.size > FILE_SIZE) {
            toast(`Размер файла не должен превышать ${FILE_STR}`, errToastConfig);
            return;
        }

        fetchModule.post({
            url: BACKEND_ADDRESS + '/api/upload/photo',
            body: formData,
            headers: {
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((responseBody) => {
                if (!responseBody.id || !responseBody.url) {
                    toast('Ошибка в загрузке фото', errToastConfig);
                } else {
                    changeNewData('avatarURL', `${BACKEND_ADDRESS}${responseBody.url}`);
                    changeField('save', true);
                }
            });
    };

    
    return (
        <div className="profile-view-container">
            <div className="profile-view-container_width">
                <div className="profile-view-container_paddding">
                    <div className="profile-view-container__img-container" 
                    onClick={() => document.getElementById('changeAvatarInput').click()}>
                        <div className="profile-view-container__img-container__button_div">
                            <div className="profile-view-container__img-container__button"/>
                        </div>
                        
                        <img src={newData.avatarURL} className="profile-view-container__img-container__img"/>
                    </div>
                    <input
                        id="changeAvatarInput"
                        style={{display: 'none'}}
                        type="file" name="addAvatarPhoto" accept="image/png, image/jpeg, image/gif"
                        onChange={(e) => addPhoto(e.target.files[0])}/>
                    <div className="profile-view-container__context-container">
                        <div className="profile-view-container__context-container__title">Данные пользователя</div>
                        {mainError && (
                            <div className="login-view-container__card__input-block__input__error-text">{mainError}</div>
                        )}

                        {userNameError && (
                            <div className="reginstration-view__input_error">{errorMap.userNameError}</div>
                        )}
                        <div className="profile-view-container__context-container_margin-bottom">
                            <input value={newData.name}
                                className={errorStyle[userNameError]}
                                onChange={e => validationField('name', e.target.value)}
                                placeholder="Имя"/>
                            <input value={newData.surname}
                                className={`${errorStyle[userNameError]} profile-view-container__context-container_margin-left`}
                                onChange={e => validationField('surname', e.target.value)}
                                placeholder="Фамилия"/>
                        </div>

                        {emailError && (
                            <div className="reginstration-view__input_error">{errorMap.emailError}</div>
                        )}
                        <div>Почта:
                            <input value={newData.email}
                                className={`${errorStyle[emailError]} profile-view-container__context-container_margin-left`}
                                onChange={e => validationField('email', e.target.value)}
                                placeholder="Электронная почта"/>
                        </div>
                        {save && (
                            <button className="login-view-container__card__button profile-view-container__button">Сохранить изменения</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileView;
