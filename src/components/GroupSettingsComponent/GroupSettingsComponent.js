import React, { useReducer } from 'react';
import './GroupSettingsComponent.css';
import '../SearchAddGroupComponent/SearchAddGroupComponent.css';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS, FILE_SIZE, FILE_STR} from '../../utils/Config/Config.js';
import { useHistory } from 'react-router-dom';

/**
 * Group settings component
 * @return {jsx}
 */
function GroupSettingsComponent({changeReload, group, cookies, okToast, errToast}) {
    const history = useHistory();

    const initialState = {
        groupInfo: group,
        mainError: '',
        titleError: false,
        urlError: false,
    };

    const errorMap = {
        titleError: 'Минимальная длина 2 символа, на конце не должно быть пробелов',
        urlError: 'Минимальная длина 3 символа. Допустимы символы: a-z, на конце не должно быть пробелов'
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

        if (file.size > FILE_SIZE) {
            errToast(`Размер файла не должен превышать ${FILE_STR}`);
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
                    errToast('Ошибка в загрузке фото');
                }

                changeGroupField('avatarURL', `${BACKEND_ADDRESS}${responseBody.url}`);
            });
    };

    function validationArea(event) {
        if (event.target.value[0] === ' ') {
            event.target.value = event.target.value.trim();
        };
    };

    function submitHandler(event) {
        event.preventDefault();

        // console.log(state);

        if (checkValidationForm()) {
            // console.log('успех');

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
                    // console.log(responseBody);

                    if (responseBody.error) {
                        setMainError(responseBody.error);
                    }
                    if (responseBody.id) {
                        // alert('Группа изменена!');
                        okToast('Сохранены изменения в группе');
                        fixErrors();
                        changeReload();
                    }
                });
        }
    };

    function submitDeleteHeader(event) {
        event.preventDefault();

        fetchModule.delete({
            url: BACKEND_ADDRESS + `/api/group/group/${groupInfo.id}`,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    okToast('Группа удалена');
                    setTimeout(() => {history.push('/allgroups')}, 2500);
                } else {
                    errToast('Что-то пошло не по плану');
                }
            });
    };

    function fixErrors() {
        setMainError('');
        changeField('titleError', false);
        changeField('urlError', false);
    }

    function fixURL(event) {
        event.target.value = event.target.value.toLowerCase();
        validationArea(event);
    };

    return (
        <div className="group-settings-component">
            <div className="group-settings-component__title">Настройки группы</div>
            {mainError && (
                <div className="search-add-group-component-container__create-group-form__card__main-error">{mainError}</div>
            )}
            {groupInfo.id && (
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
                        onInput={validationArea}
                        onChange={event => validationField('title', event.target.value)}
                        value={groupInfo.title}
                        className={errStyle[titleError]}/>
                    {titleError && (
                        <div className="search-add-group-component-container__create-group-form__card__form__input__error-text"
                        >{errorMap['titleError']}</div>
                    )}

                    <div className="search-add-group-component-container__create-group-form__card__form__text">Адрес</div>
                    
                    <div className="search-add-group-component-container__create-group-form__card__form__text__url-block">
                    <div className="search-add-group-component-container__create-group-form__card__form__text__url-block__text">{`${BACKEND_ADDRESS.replace('-', '‑')}/group/`}</div>
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

                    <div className="group-settings-container__buttons">
                        <button
                            className="group-settings-container__buttons__del-button"
                            onClick={(e) => submitDeleteHeader(e)}>Удалить группу</button>
                        <button
                            onClick={(e) => submitHandler(e)}
                            className="search-add-group-component-container__create-group-form__card__form__button group-settings-container__buttons__ok-button">Сохранить изменения</button>
                    </div>
                </form>
            </div>
            )}
        </div>
    );
}

export default GroupSettingsComponent;
