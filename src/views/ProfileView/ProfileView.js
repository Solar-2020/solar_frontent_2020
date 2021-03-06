import React, { useReducer, useEffect } from 'react';
import './ProfileView.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS, okToastConfig, errToastConfig, FILE_SIZE, FILE_STR} from '../../utils/Config/Config.js';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Profile view
 */
function ProfileView({cookies, userData, changeData}) {
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
        'true': 'login-view-input-block-input-error',
        'false': 'login-view-block-input',
    };

    const checkNewDatatFields = () => {
        const arr = Object.keys(newData).filter(elem => newData[elem] !== oldData[elem]);
       (arr.length > 0) ? changeField('save', true) : changeField('save', false);
    };

    const validationField = (key, value) => {
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

    const handleSubmit = (event) => {
        event.preventDefault();

        const form = {
            'name': newData.name,
            'surname': newData.surname,
            'avatarURL': newData.avatarURL,
            'email': newData.email,
        };

        if (checkValidationForm()) {
            // console.log(form);

            fetchModule.put({
                url: BACKEND_ADDRESS + `/api/account/user`,
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies.get('SessionToken'),
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((responseBody) => {
                    if (responseBody.error) {
                        changeField('mainError', responseBody.error);
                    } else {
                        changeData('userData', responseBody);
                        changeField('save', false);
                        changeField('mainError', '');
                        toast('Данные успешно изменены', okToastConfig);
                    }
                });
        }
    };

    const checkValidationForm = () => {
        let flag = true;

        if (!regExpr.FIO.test(newData.name) || !regExpr.FIO.test(newData.surname)) {
            changeField('userNameError', true);
            flag = false;
        } else {
            changeField('userNameError', false);
        }

        if (!regExpr.email.test(newData.email)) {
            changeField('emailError', true);
            flag = false;
        } else {
            changeField('emailError', false);
        }
        return flag;
    };

    function Greeting() {
        if (/photos/.test(newData.avatarURL)) {
            return (<img src={newData.avatarURL} className="profile-view-container__img-view"/>);
        }
        if (!newData.avatarURL.length) {
            return (<img className="profile-view-container__img-view"/>);
        }

        const yandexIn = 'https://avatars.mds.yandex.net/get-yapic/';
        const yandexOut = '/islands-300'
        return (<img src={`${yandexIn}${newData.avatarURL}${yandexOut}`} className="profile-view-container__img-view"/>);
    };
      

    return (
        <div className="profile-view-container">
            <div className="profile-view-container_width">
                <div className="profile-view-container_paddding">
                    <ToastContainer/>

                    <div className="profile-view-container__img-container" 
                    onClick={() => document.getElementById('changeAvatarInput').click()}>
                        <div className="profile-view-container__img-button_div">
                            <div className="profile-view-container__img-button"/>
                        </div>
                        {newData.id && (
                            <Greeting/>
                        )}
                    </div>

                    <input
                        id="changeAvatarInput"
                        style={{display: 'none'}}
                        type="file" name="addAvatarPhoto" accept="image/png, image/jpeg, image/gif"
                        onChange={(e) => addPhoto(e.target.files[0])}/>

                    <div className="profile-view-container-context">
                        <div className="profile-view-container-context__title">Данные пользователя</div>

                        {mainError && (
                            <div className="reginstration-view-input_error">{mainError}</div>
                        )}

                        {userNameError && (
                            <div className="reginstration-view-input_error">{errorMap.userNameError}</div>
                        )}

                        <div className="profile-view-container-context_margin-bottom">
                            <input value={newData.name}
                                className={errorStyle[userNameError]}
                                onChange={e => validationField('name', e.target.value)}
                                placeholder="Имя"/>
                            <input value={newData.surname}
                                className={`${errorStyle[userNameError]} profile-view-container-context_margin-left-top`}
                                onChange={e => validationField('surname', e.target.value)}
                                placeholder="Фамилия"/>
                        </div>

                        {emailError && (
                            <div className="reginstration-view-input_error">{errorMap.emailError}</div>
                        )}

                        <div>Почта:
                            <input value={newData.email}
                                className={`${errorStyle[emailError]} profile-view-container-context_margin-left`}
                                onChange={e => validationField('email', e.target.value)}
                                placeholder="Электронная почта"/>
                        </div>

                        {save && (
                            <button className="login-view-card-button profile-view-container__button" onClick={(e) => handleSubmit(e)}>Сохранить изменения</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileView;
