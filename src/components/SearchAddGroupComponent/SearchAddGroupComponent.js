import React, {useReducer} from 'react';
import './SearchAddGroupComponent.css';
import searchImg from '../../images/search-glass.svg';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import fetchModule from '../../utils/API/FetchModule.js';

/**
 * Header component
 * @return {jsx}
 */
function SearchAddGroupComponent({changeAllGroups}) {
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
        titleError: 'Допустимы символы: a-z, A-Z, а-яб А-Я, _',
        urlError: 'Допустимы символы: a-z'
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
                url: BACKEND_ADDRESS + '/group/group',
                body: JSON.stringify(data),
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
                    if (responseBody.creatAt) {
                        alert('Группа создана успешно!');
                        changeAllGroups(responseBody.id);
                        closeForm();
                    }
                });
        }
    };

    function checkValidationForm() {
        if (!/^[а-яA-Яa-zA-Z]+[а-яA-Яa-zA-Z _]+[а-яA-Яa-zA-Z]+$/.test(title.trim())) {
            changeField('titleError', true);
            return false;
        } else {
            changeField('titleError', false);
        }

        if (!/^[a-z]{3,}$/.test(URL.trim())) {
            changeField('urlError', true);
            return false;
        } else {
            changeField('urlError', false);
        }

        return true;
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
        })
            .then((response) => {
                return response.json();
            })
            .then((responseBody) => {
                if (!responseBody.id || !responseBody.url) {
                    alert('Искать ошибку в запросе для создания фото');
                }

                changeField('avatarURL', `${BACKEND_ADDRESS}${responseBody.url}`);
            });
    };

    function validationArea(event) {
        if (event.target.value[0] === ' ') {
            event.target.value = event.target.value.slice(1);
        };
    };

    return (
        <div className="search-add-group-component-container">
            <form className="search-add-group-component-container__form">
                <img
                    alt=""
                    className="search-add-group-component-container__form__glass"
                    src={searchImg}/>
                <input
                    className="search-add-group-component-container__form__input"
                    placeholder="Поиск"/>
            </form>
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

                        <form
                            onSubmit={submitHandler}
                            className="search-add-group-component-container__create-group-form__card__form">
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
                            <div className="search-add-group-component-container__create-group-form__card__form__text">Название</div>
                            <input
                                type="text" name="title" placeholder="Введите название"
                                pattern="[а-яA-Яa-zA-Z]+[а-яA-Яa-zA-Z _]+[а-яA-Яa-zA-Z]+"
                                onChange={event => changeField('title', event.target.value)}
                                className="search-add-group-component-container__create-group-form__card__form__input"/>
                            {titleError && (
                                <div className="search-add-group-component-container__create-group-form__card__form__input__error-text"
                                >{errorMap['titleError']}</div>
                            )}

                            <div className="search-add-group-component-container__create-group-form__card__form__text">Адрес</div>
                            <input
                                type="text" name="url" placeholder="Введите url группы"
                                pattern="[a-z]{3,}"
                                onInput={event => changeField('URL', event.target.value)}
                                className="search-add-group-component-container__create-group-form__card__form__input"/>
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
