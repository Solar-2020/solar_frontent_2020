import React, { useReducer } from 'react';
import './GroupSettingsComponent.css';
import '../SearchAddGroupComponent/SearchAddGroupComponent.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Group settings component
 * @return {jsx}
 */
function GroupSettingsComponent({group, setGroup, cookies}) {
    const initialState = {
        groupInfo: group,
        mainError: '',
        titleError: false,
        urlError: false,
    };

    const errorMap = {
        titleError: 'Минимальная длина 2 символа',
        urlError: 'Минимальная длина 3 символа. Допустимы символы: a-z'
    };

    const errStyle = {
        'true': 'search-add-group-component-container__create-group-form__card__form__input__error-input',
        'false': 'search-add-group-component-container__create-group-form__card__form__input',
    };

    const regExpr = {
        'title': /^[^\s]+.*[^\s]+$/,
        'URL': /^[a-z]{3,}$/,
    };

    function changeField(field, value) {
        dispatch({type: 'CHANGE_FIELD', field, value})
    };

    function changeGroupField(field, value) {
        dispatch({type: 'CHANGE_GROUP_FIELD', field, value})
    };

    function setMainError(message) {
        dispatch({type: 'SET_MAIN_ERROR', message})
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'CHANGE_GROUP_FIELD':
                    return {... state, groupInfo: {...state.groupInfo, [action.field]: action.value}}
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
        groupInfo,
        mainError,
        titleError,
        urlError,
    } = state;


    function checkValidationForm() {
        let flag = true;

        if (!regExpr.title.test(groupInfo.title)) {
            changeField('titleError', true);
            flag = false;
        } else {
            changeField('titleError', false);
        }

        if (!regExpr.URL.test(groupInfo.URL)) {
            changeField('urlError', true);
            flag = false;
        } else {
            changeField('urlError', false);
        }

        return flag
    };

    function validationField(key, value) {
        changeGroupField(key, value);

        switch(key) {
            case 'title':
                if (!regExpr.title.test(value)) {
                    changeField('titleError', true);
                } else {
                    changeField('titleError', false);
                }
                break;
            case 'URL':
                if (!regExpr.URL.test(value)) {
                    changeField('urlError', true);
                } else {
                    changeField('urlError', false);
                }
                break;
            default:
                break;
        };
    };

    const addImageToPostFetch = (event) => {
        event.preventDefault();
        addPhoto(event.target.files[0]);
    };

    const addPhoto = (file) => {
        const formData = new FormData();
        formData.append('body', JSON.stringify({name: file.name}));
        formData.append('file', file);

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
                    alert('Искать ошибку в запросе для создания фото');
                }

                changeGroupField('avatarURL', `${BACKEND_ADDRESS}${responseBody.url}`);
            });
    };

    function validationArea(event) {
        if (event.target.value[0] === ' ') {
            event.target.value = event.target.value.slice(1);
        };
    };

    function submitHandler(event) {
        event.preventDefault();

        console.log(state);

        if (checkValidationForm()) {
            console.log('успех');

            const data = {
                title: groupInfo.title,
                description: groupInfo.description,
                URL: groupInfo.URL,
                avatarURL: groupInfo.avatarURL,
            };

            fetchModule.put({
                url: BACKEND_ADDRESS + `/api/group/group/${groupInfo.id}`,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies.get('SessionToken'),
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
                    if (responseBody.id) {
                        // alert('Группа изменена!');
                        fixErrors();
                        setGroup(responseBody);
                    }
                });
        }
    };

    function fixErrors() {
        setMainError('');
        changeField('titleError', false);
        changeField('urlError', false);
    }

    function fixURL(event) {
        event.target.value = event.target.value.toLowerCase();
    };

    return (
        <div className="group-settings-component">
            <div className="group-settings-component__title">Настройки группы</div>
            {mainError && (
                <div className="search-add-group-component-container__create-group-form__card__main-error">{mainError}</div>
            )}
            {group.id && (
                <div>
                    <div className="search-add-group-component-container__create-group-form__card__form__avatar-photo-container">
                        {groupInfo.avatarURL !== '' ? (
                            <img
                                className=" group-settings-component__photo_height search-add-group-component-container__create-group-form__card__form__avatar-photo-container__avatar"
                                alt="" src={groupInfo.avatarURL}/>
                        ) : (
                            <img alt="" className="group-settings-component__photo_height search-add-group-component-container__create-group-form__card__form__avatar-photo-container__avatar"/>
                        )}
                        <button
                            id="addAvatarGroup"
                            value="photo"
                            className="search-add-group-component-container__create-group-form__card__form__avatar-photo-container__button"
                            onClick={() => document.getElementById('changeAvatarGroupInput').click()}/>
                        <input
                            id="changeAvatarGroupInput"
                            style={{display: 'none'}}
                            type="file" name="addAvatarPhoto" accept="image/png, image/jpeg, image/gif"
                            onChange={addImageToPostFetch}/>
                    </div>
                    <form
                    className="search-add-group-component-container__create-group-form__card__form">
                    <div className="search-add-group-component-container__create-group-form__card__form__text">Название</div>
                    <input
                        type="text" name="title" placeholder="Введите название"
                        onChange={event => validationField('title', event.target.value)}
                        value={groupInfo.title}
                        className={errStyle[titleError]}/>
                    {titleError && (
                        <div className="search-add-group-component-container__create-group-form__card__form__input__error-text"
                        >{errorMap['titleError']}</div>
                    )}

                    <div className="search-add-group-component-container__create-group-form__card__form__text">Адрес</div>
                    
                    <div className="search-add-group-component-container__create-group-form__card__form__text__url-block">
                    <div className="search-add-group-component-container__create-group-form__card__form__text__url-block__text">http://develop.nlmail.ru/group/</div>
                        <input
                            type="text" name="url" placeholder="Введите url группы"
                            onChange={event => validationField('URL', event.target.value)}
                            onInput={fixURL}
                            value={groupInfo.URL}
                            className={`${errStyle[urlError]} search-add-group-component-container__input_margin`}/>
                    </div>
                    {urlError && (
                        <div className="search-add-group-component-container__create-group-form__card__form__input__error-text">
                            {errorMap['urlError']}</div>
                    )}

                    <div className="search-add-group-component-container__create-group-form__card__form__text">Описание</div>
                    <textarea
                        type="text" name="description" placeholder="Введите описание"
                        pattern=".+"
                        onInput={validationArea}
                        onChange={event => changeGroupField('description', event.target.value)}
                        value={groupInfo.description}
                        className="search-add-group-component-container__create-group-form__card__form__textarea"/>

                    <button
                        onClick={(e) => submitHandler(e)}
                        className="search-add-group-component-container__create-group-form__card__form__button">Изменить данные</button>
                </form>
            </div>
            )}
        </div>
    );
}

export default GroupSettingsComponent;
