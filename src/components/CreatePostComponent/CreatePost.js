import React, {useReducer} from 'react';
import InterviewForm from './InterviewComponent/InterviewForm';
import InterviewElements from './InterviewComponent/InterviewElements';
import './CreatePost.css';
import './InterviewComponent/InterviewComp.css';
import PaymentComponent from './PaymentComponent/PaymentComponent';
import DocsComponent from './DocsComponent/DocsComponent';
import PhotoComponent from './PhotoComponet/PhotoComponent';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS, FILE_SIZE, FILE_STR} from '../../utils/Config/Config.js';

/**
 * Create post component
 * @return {jsx}
 */
function CreatePost({changeReload, cookies, id, okToast, errToast, userData}) {
    const initialState = {
        interviewError: false,
        interviewElems: [],
        interviewType: 1,
        interviewComp: false,
        interviewTitle: '',

        paymentComp: false,
        paymentArrays: {
            phones: [],
            cards: [],
            moneys: [],
        },
        paymentValue: 0,

        docsComp: [],
        photoComp: [],
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                case 'CLEAN_FORM':
                    return {...initialState};
                case 'CHANGE_PAYMENT_ARRAY':
                    return {...state, paymentArrays: {...state.paymentArrays, [action.field]: action.value}};
                case 'CHANGE_PAYMENT':
                    return {...state, paymentArrays: {...state.paymentArrays, [action.field]: state.paymentArrays[action.field].concat(action.value)}};
                default:
                    return state;
            }
        },
        initialState
    );

    const changeField = (field, value) => {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    const cleanForm = () => {
        dispatch({type: 'CLEAN_FORM'});
    };

    const changeArray = (field, value) => {
        dispatch({type: 'CHANGE_PAYMENT_ARRAY', field, value});
    };

    const deleteArraysElem = (key, id) => {
        const newArray = paymentArrays[key].filter((elem, index) => index !== id);
        changeArray(key, newArray);
    };

    const {
        interviewError,
        interviewElems,
        interviewType,
        interviewComp,
        interviewTitle,

        paymentComp,
        paymentArrays,
        paymentValue,

        docsComp,
        photoComp,
    } = state;

    const changePaymentHandler = (field, value) => {
        dispatch({type: 'CHANGE_PAYMENT', field, value});
    };

    const addInterviewElemHandler = (value) => {
        const elems = interviewElems.slice();

        const lastId = (elems.length) ? elems[elems.length - 1].id : 0;
        elems.push({id: lastId + 1, title: value});

        changeField('interviewElems', elems);
    };

    const delInterviewElemHandler = (id) => {
        const elems = interviewElems.filter((elem) => elem.id !== id);
        changeField('interviewElems', elems);
    };

    const delDocElemHandler = (id) => {
        const elems = docsComp.filter((elem) => elem.id !== id);
        changeField('docsComp', elems);
    };

    const delPhotoHandler = (id) => {
        const elems = photoComp.filter((elem) => elem.id !== id);
        changeField('photoComp', elems);
    };

    const changeComponentsView = (key, response={}) => {
        switch (key) {
        case 'interview':
            if (!interviewComp) changeField('interviewComp', !interviewComp);
            break;

        case 'payment':
            if (!paymentComp) changeField('paymentComp', !paymentComp);
            break;

        case 'docs':
            const docsElems = docsComp.slice();
            docsElems.push({id: response.id, title: response.name, url: `${BACKEND_ADDRESS}${response.url}`});
            changeField('docsComp', docsElems);
            break;

        case 'photo':
            const photoElems = photoComp.slice();
            photoElems.push({id: response.id, url: `${BACKEND_ADDRESS}${response.url}`});
            changeField('photoComp', photoElems);
            break;

        default:
            break;
        }
    };

    const addImageToPostFetch = (event) => {
        event.preventDefault();
        postPhoto(event.target.files[0]);
    };

    const addDocToPostFetch = (event) => {
        event.preventDefault();
        postFile(event.target.files[0]);
    };

    const delInterviewComponent = () => {
        changeField('interviewTitle', '');
        changeField('interviewComp', !interviewComp);
    };

    const postPhoto = (file) => {
        const formData = new FormData();
        formData.append('body', JSON.stringify({name: file.name}));
        formData.append('file', file);

        if (file.size > FILE_SIZE) {
            errToast(`Размер файл не должен превышать ${FILE_STR}`);
            return;
        };

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
                    // alert('Искать ошибку в запросе для создания фото');
                    errToast('Ошибка при добавлении фото');
                }
                changeComponentsView('photo', responseBody);
            });
    };

    const postFile = (file) => {
        const formData = new FormData();
        formData.append('body', JSON.stringify({name: file.name}));
        formData.append('file', file);
    
        if (file.size > FILE_SIZE) {
            errToast(`Размер файл не должен превышать ${FILE_STR}`);
            return;
        };

        fetchModule.post({
            url: BACKEND_ADDRESS + '/api/upload/file',
            body: formData,
            headers: {
                'Cookie': cookies.get('SessionToken'),
            }
        })
            .then((response) => {
                return response.json();
            })
            .then((responseBody) => {
                if (!responseBody.id || !responseBody.url) {
                    errToast('Ошибка при добавлении документа');
                }
                changeComponentsView('docs', responseBody);
            });
    };

    const checkInterview = () => {
        if (!interviewTitle.trim() || interviewElems.filter(elem => elem.title.trim()).length < 2) {
            changeField('interviewError', true);
            return false;
        };

        changeField('interviewError', false);
        return true;
    };

    const checkBeforFetch = () => {
        if (interviewComp) {
            return checkInterview();
        }
        return true;
    };

    const createMethods = () => {
        let methods = [];
        paymentArrays.phones.forEach((elem) => methods.push({type: 'phone', phoneNumber: elem}));
        paymentArrays.cards.forEach((elem) => methods.push({type: 'card', phoneNumber: elem.cardPhone, cardNumber: elem.cardNumber}));
        paymentArrays.moneys.forEach((elem) => methods.push({type: 'yoomoney', yoomoneyAccount: elem}));

        return methods;
    };

    const submitInfo = () => {
        const methods = createMethods();

        let form = {
            groupID: Number(id),
            text: document.getElementById('createPostComponentText').value,
            interviews: [
                {
                    text: interviewTitle,
                    type: interviewType,
                    answers: interviewElems.reduce((acc, elem) => {
                        acc.push({text: elem.title});
                        return acc;
                    }, []),
                },
            ],
            photos: photoComp.reduce((acc, elem) => {
                acc.push(elem.id);
                return acc;
            }, []),
            files: docsComp.reduce((acc, elem) => {
                acc.push(elem.id);
                return acc;
            }, []),
            payments: [
                {
                    paymentValue: paymentValue,
                    methods: methods,
                }],
        };

        if (!form.interviews[0].text.trim()) {
            form = {...form, interviews: []};
        }

        if (paymentComp && !paymentValue) {
            errToast(`Заполните поле суммы`);
            return;
        };

        if (paymentComp && !paymentArrays.phones.length && !paymentArrays.cards.length && !paymentArrays.moneys.length) {
            errToast(`Заполните реквизиты для оплаты`);
            return;
        };

        if (form.payments[0].paymentValue === 0 ) {
            form = {...form, payments: []};
        }

        // console.log(form);

        if (checkBeforFetch()) {
            fetchModule.post({
                url: BACKEND_ADDRESS + '/api/posts/post',
                body: JSON.stringify(form),
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookies.get('SessionToken'),
                },
            })
                .then((response) => {
                    // console.log(response);
                    // if (response.status === 200) alert('Успешно отправлен пост!');
                    return response.json();
                })
                .then((responseBody) => {
                    // if (!responseBody.id || !responseBody.url) {
                    //     alert('Искать ошибку в запросе для отправки поста');
                    // }
                    if (responseBody.id) {
                        // pushFrontNewPost([{...form, id: responseBody.id, publishDate: responseBody.publishDate}]);
                        changeReload();
                        clearPostForm();
                        okToast('Пост создан успешно');
                    } else if (responseBody.error) {
                        errToast(`Ошибка при создании поста: ${responseBody.error}`);
                    } else {
                        errToast('Пост не был создан');
                    }
                });
        };
    };

    const clearPostForm = () => {
        cleanForm();
        document.getElementById('createPostComponentText').value = '';
    };

    const delPaymentComp = () => {
        changeField('paymentComp', false);
        changeField('paymentValue', 0);
        changeField('paymentArrays', initialState.paymentArrays);
    };

    function Greeting({avatar}) {
        if (/photos/.test(avatar)) {
            return (<img src={avatar} className="create-post-component__white-part__avatar-text__avatar"/>);
        }
        if (!avatar.length) {
            return (<img className="create-post-component__white-part__avatar-text__avatar"/>);
        }

        const yandexIn = 'https://avatars.mds.yandex.net/get-yapic/';
        const yandexOut = '/islands-300'
        return (<img src={`${yandexIn}${avatar}${yandexOut}`} className="create-post-component__white-part__avatar-text__avatar"/>);
    };

    return (
        <div className="create-post-component">
            <div className="create-post-component__white-part">
                <div className="create-post-component__white-part__avatar-text">
                    {userData.id && (
                        <Greeting avatar={userData.avatarURL}/>
                    )}
                    <textarea id="createPostComponentText" className="create-post-component__white-part__avatar-text__text" placeholder="Добавьте текст.."></textarea>
                </div>
                {interviewComp && (
                    <div className="create-post-component__white-part__interview-container">
                        {interviewError && (
                            <div className="create-post-component__white-part__interview-container__error">Тема должна быть заполнена. В опросе следует иметь больше одного ответа</div>
                        )}
                        <div className="interwiew-component__title-container">
                            <div className="create-post-component__white-part__interview-container__title">Тема опроса</div>
                            <button className="create-post-component__white-part__interview-container__title__input-container__button" onClick={() => delInterviewComponent()}></button>
                        </div>
                        <div className="create-post-component__white-part__interview-container__title__input-container">
                            <input
                                type="text"
                                placeholder="Введите название опроса"
                                value={interviewTitle}
                                onChange={(e) => changeField('interviewTitle', e.target.value)}
                                className="create-post-component__white-part__interview-container__title__input-container__input"
                            />
                            {/* <button className="create-post-component__white-part__interview-container__title__input-container__button" onClick={() => delInterviewComponent()}></button> */}
                        </div>
                        <InterviewElements interviewElems={interviewElems} delHandler={delInterviewElemHandler}/>
                        <InterviewForm addHandler={addInterviewElemHandler}/>

                        <div className="create-post-component__white-part__interview-container__title 
                        create-post-component__white-part__interview-container__answers-type_margin">Количество ответов</div>
                            <select
                                className="create-post-component__white-part__interview-container__answers-type"
                                onChange={(e) => changeField('interviewType', Number(e.target.value))}>
                                <option value="1">Один вариант ответа</option>
                                <option value="2">Много вариантов ответа</option>
                            </select>
                        </div>
                )}
                {paymentComp && (
                    <PaymentComponent delPaymentComp={delPaymentComp} changePaymentHandler={changePaymentHandler} paymentArrays={paymentArrays} deleteElem={deleteArraysElem} changeValue={changeField}/>
                )}
                {photoComp.length > 0 && (
                    <PhotoComponent photos={photoComp} delPhotoHandler={delPhotoHandler}/>
                )}
                {docsComp.length > 0 && (
                    <DocsComponent docs={docsComp} delDocHandler={delDocElemHandler}/>
                )}

            </div>
            <div className="create-post-component__green-part">
                <button
                    title="Фото"
                    id="createPostComponentGreenPartPhoto"
                    value="photo"
                    className="create-post-component__green-part__buttons create-post-component__green-part__buttons_photo"
                    onClick={() => document.getElementById('createPostComponentGreenPartAddPhoto').click()}/>
                <input
                    id="createPostComponentGreenPartAddPhoto"
                    style={{display: 'none'}}
                    type="file" name="addPostPhoto" accept="image/png, image/jpeg, image/gif"
                    onChange={addImageToPostFetch}/>

                <button
                    title="Опрос"
                    className="create-post-component__green-part__buttons create-post-component__green-part__buttons_survey"
                    onClick={() => changeComponentsView('interview')}/>
                <button
                    title="Оплата"
                    className="create-post-component__green-part__buttons create-post-component__green-part__buttons_payment"
                    onClick={() => changeComponentsView('payment')}/>

                <button
                    title="Документ"
                    id="createPostComponentGreenPartDocAdd"
                    value="doc"
                    onClick={() => document.getElementById('createPostComponentGreenPartDoc').click()}
                    className="create-post-component__green-part__buttons create-post-component__green-part__buttons_doc"/>
                <input
                    id="createPostComponentGreenPartDoc"
                    style={{display: 'none'}}
                    type="file" name="addPostDoc"
                    onChange={addDocToPostFetch}/>

                <button className="create-post-component__green-part__buttons_create-post create-post_btn-p" onClick={() => submitInfo()}>Опубликовать</button>
            </div>
        </div>
    );
}

export default CreatePost;
