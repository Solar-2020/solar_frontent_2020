import React, {useReducer} from 'react';
import './SearchAddGroupComponent.css';
import searchImg from '../../images/search-glass.svg';
import {BACKEND_ADDRESS, errToastConfig} from '../../utils/Config/Config.js';
import fetchModule from '../../utils/API/FetchModule.js';

/**
 * Header component
 * @return {jsx}
 */
function SearchAddGroupComponent({changeAllGroups, cookies, okToast, errToast, changeSearch}) {
    const initialState = {
        isOpenAddGroupModal: false,
        title: '',
        description: '',
        URL: '',
        avatarURL: '',
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

    function setMainError(message) {
        dispatch({type: 'SET_MAIN_ERROR', message})
    };

    function toggleAddGroupModal() {
        dispatch({type: 'TOGGLE_ADD_GROUP_MODAL'})
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'TOGGLE_ADD_GROUP_MODAL':
                    return { ...state, isOpenAddGroupModal: !state.isOpenAddGroupModal }
                case 'CHANGE_FIELD':
                    return { ...state, [action.field]: action.value }
                case 'SET_MAIN_ERROR':
                    return { ...state, mainError: action.message }
                case 'CLEAN_FORM':
                    return { ...initialState }
                default:
                    return state
            }
        },
        initialState
    );

    const {
        isOpenAddGroupModal,
        title,
        description,
        URL,
        avatarURL,
        mainError,
        titleError,
        urlError,
    } = state;

    function submitHandler(event) {
        event.preventDefault();

        console.log(state);

        if (checkValidationForm()) {
            console.log('успех');

            const data = {
                title,
                description,
                URL,
                avatarURL,
            }

            fetchModule.post({
                url: BACKEND_ADDRESS + '/api/group/group',
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
                    if (responseBody.creatAt) {
                        // alert('Группа создана успешно!');
                        changeAllGroups(responseBody.id);
                        closeForm();
                        okToast('Группа создана успешно')
                    }
                });
        }
    };

    function checkValidationForm() {
        let flag = true;

        if (!regExpr.title.test(title)) {
            changeField('titleError', true);
            flag = false;
        } else {
            changeField('titleError', false);
        }

        if (!regExpr.URL.test(URL)) {
            changeField('urlError', true);
            flag = false;
        } else {
            changeField('urlError', false);
        }

        return flag;
    };

    function validationField(key, value) {
        changeField(key, value);

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

    const closeForm = () => {
        dispatch({type: 'TOGGLE_ADD_GROUP_MODAL'});
        dispatch({type: 'CLEAN_FORM'});
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
                    errToast('Фотография не была загружена');
                }

                changeField('avatarURL', `${BACKEND_ADDRESS}${responseBody.url}`);
            });
    };

    function validationArea(event) {
        if (event.target.value[0] === ' ') {
            event.target.value = event.target.value.slice(1);
        };
    };

    function validationUrl(event) {
        event.target.value = event.target.value.toLowerCase();
    };

    return (
        <div className="search-add-group-component-container">
            <div className="search-add-group-component-container__form">
                <img
                    alt=""
                    className="search-add-group-component-container__form__glass"
                    src={searchImg}/>
                <input
                    className="search-add-group-component-container__form__input"
                    placeholder="Поиск"
                    onChange={(e) => changeSearch(e.target.value)}/>
            </div>
            <button
                onClick={() => toggleAddGroupModal()}
                className="search-add-group-component-container__button"/>

            {isOpenAddGroupModal && (
                <div className="search-add-group-component-container__create-group-form">
                    <div className="search-add-group-component-container__create-group-form__card">
                        <div className="search-add-group-component-container__create-group-form__card__header">
                            <div className="search-add-group-component-container__create-group-form__card__header__title">Создание группы</div>
                            <button
                                onClick={() => closeForm()}
                                className="search-add-group-component-container__create-group-form__card__header__close-button"/>
                        </div>

                        {mainError && (
                            <div className="search-add-group-component-container__create-group-form__card__main-error">{mainError}</div>
                        )}

                        <div className="search-add-group-component-container__create-group-form__card__form__avatar-photo-container">
                            {avatarURL !== '' ? (
                                <img
                                    className="search-add-group-component-container__create-group-form__card__form__avatar-photo-container__avatar"
                                    alt="" src={avatarURL}/>
                            ) : (
                                <img alt="" className="search-add-group-component-container__create-group-form__card__form__avatar-photo-container__avatar"/>
                            )}
                            <button
                                id="addAvatarGroup"
                                value="photo"
                                className="search-add-group-component-container__create-group-form__card__form__avatar-photo-container__button"
                                onClick={() => document.getElementById('addAvatarGroupInput').click()}/>
                            <input
                                id="addAvatarGroupInput"
                                style={{display: 'none'}}
                                type="file" name="addAvatarPhoto" accept="image/png, image/jpeg, image/gif"
                                onChange={addImageToPostFetch}/>
                        </div>

                        <form
                            onSubmit={submitHandler}
                            className="search-add-group-component-container__create-group-form__card__form">
                            <div className="search-add-group-component-container__create-group-form__card__form__text">Название</div>
                            <input
                                type="text" name="title" placeholder="Введите название"
                                onChange={event => validationField('title', event.target.value)}
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
                                    onInput={validationUrl}
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
                                onChange={event => changeField('description', event.target.value)}
                                className="search-add-group-component-container__create-group-form__card__form__textarea"/>

                            <button
                                type="submit"
                                className="search-add-group-component-container__create-group-form__card__form__button">Создать группу</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SearchAddGroupComponent;
