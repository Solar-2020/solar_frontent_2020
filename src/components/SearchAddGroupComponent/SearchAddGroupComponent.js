import React, { useState } from 'react';
import './SearchAddGroupComponent.css';
import searchImg from '../../images/search-glass.svg';

/**
 * Header component
 * @return {jsx}
 */
function SearchAddGroupComponent({changeAllGroups}) {
    const [addGroup, setAddGroup] = useState(false);
    const [dataGroup, setDataGroup] = useState({title: '', url: '', description: ''});
    const [errorsData, setErrorsData] = useState({
        mainError: {isErr: false, message: ''},
        title: {isErr: false, message: 'Допустимы символы: a-z, A-Z, а-яб А-Я, _'},
        url: {isErr: false, message: 'Допустимы символы: a-z'},
    });

    const submitHandler = (event) => {
        event.preventDefault();

        if (checkValidationForm(event)) {
            console.log('успех');
        }
    };

    const getDataFromForm = (event) => {
        return {
            title: event.target.elements['title'].value.trim(),
            url: event.target.elements['url'].value.trim(),
            description: event.target.elements['description'].value.trim(),
        };
    };

    const checkValidationForm = (event) => {
        if (event.target.elements['title'].value.trim() === '' ||
        event.target.elements['title'].patternMismatch) {
            return false;
        }

        if (event.target.elements['url'].value.trim() === '' ||
        event.target.elements['url'].patternMismatch) {
            return false;
        }

        return true;
    }

    const closeForm = () => {
        setAddGroup(!addGroup);
        cleanForm();
    };

    const cleanForm = () => {
        setDataGroup({title: '', url: '', description: ''});

        const newObj = Object.assign({}, errorsData);
        newObj.mainError.isErr = false;
        newObj.title.isErr = false;
        newObj.url.isErr = false;
        setErrorsData(newObj);
    }

    const validationTitle = (event) => {
        if (event.target.value[0] === ' ') {
            event.target.value = event.target.value.slice(1);
        };

        const newObj = Object.assign({}, errorsData);

        if (event.target.validity.patternMismatch) {
            newObj.title.isErr = true;
        } else {
            newObj.title.isErr = false;
        };

        setErrorsData(newObj);
    };

    const validationUrl = (event) => {
        if (event.target.value[0] === ' ') {
            event.target.value = event.target.value.slice(1);
        };

        const newObj = Object.assign({}, errorsData);

        if (event.target.validity.patternMismatch) {
            newObj.url.isErr = true;
        } else {
            newObj.url.isErr = false;
        };

        setErrorsData(newObj);
    };

    const validationArea = (event) => {
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
                onClick={() => setAddGroup(!addGroup)}
                className="search-add-group-component-container__button"/>
            
            {addGroup && (
                <div className="search-add-group-component-container__create-group-form">
                    <div className="search-add-group-component-container__create-group-form__card">
                        <div className="search-add-group-component-container__create-group-form__card__header">
                            <div className="search-add-group-component-container__create-group-form__card__header__title">Создание группы</div>
                            <button 
                                onClick={() => closeForm()}
                                className="search-add-group-component-container__create-group-form__card__header__close-button"/>
                        </div>

                        {errorsData.mainError.isErr && (
                            <div className="search-add-group-component-container__create-group-form__card__main-error">{errorsData.mainError.message}</div>
                        )}

                        <form 
                            onSubmit={submitHandler}
                            className="search-add-group-component-container__create-group-form__card__form">
                            <div></div>
                            <div className="search-add-group-component-container__create-group-form__card__form__text">Название</div>
                            <input 
                                type="text" name="title" placeholder="Введите название"
                                pattern="[а-яA-Яa-zA-Z _]+"
                                onInput={validationTitle}
                                className="search-add-group-component-container__create-group-form__card__form__input"/>
                            {errorsData.title.isErr && (
                                <div className="search-add-group-component-container__create-group-form__card__form__input__error-text"
                                >{errorsData.title.message}</div>
                            )}
                            
                            <div className="search-add-group-component-container__create-group-form__card__form__text">Адрес</div>
                            <input 
                                type="text" name="url" placeholder="Введите url группы"
                                pattern="[a-z]+"
                                onInput={validationUrl}
                                className="search-add-group-component-container__create-group-form__card__form__input"/>
                            {errorsData.url.isErr && (
                                <div className="search-add-group-component-container__create-group-form__card__form__input__error-text">
                                {errorsData.url.message}</div>
                            )}
                            
                            <div className="search-add-group-component-container__create-group-form__card__form__text">Описание</div>
                            <textarea
                                type="text" name="description" placeholder="Введите описание"
                                pattern=".+"
                                onInput={validationArea}
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
