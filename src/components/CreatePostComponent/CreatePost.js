import React, {useState} from 'react';
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
function CreatePost({changeReload, cookies, id, okToast, errToast}) {
    const [interviewError, setInterviewError] = useState(false);

    const [interviewElems, setInterviewElems] = useState([]);
    const [interviewType, setInterviewType] = useState(1);
    const [interviewComp, setInterviewComp] = useState(false);
    const [interviewTitle, setInterviewTitle] = useState('');

    const [paymentComp, setPaymentComp] = useState(false);
    const [paymentValue, setPaymentValue] = useState({requisite: '', cost: 0, currency: 1});

    const [docsComp, setDocsComp] = useState([]);
    const [photoComp, setPhotoComp] = useState([]);

    const changePaymentHandler = (key, value) => {
        const newPayment = Object.assign({}, paymentValue);
        newPayment[key] = value;
        setPaymentValue(newPayment);
    };

    const addInterviewElemHandler = (value) => {
        const elems = interviewElems.slice();

        const lastId = (elems.length) ? elems[elems.length - 1].id : 0;
        elems.push({id: lastId + 1, title: value});

        setInterviewElems(elems);
    };

    const delInterviewElemHandler = (id) => {
        const elems = interviewElems.filter((elem) => elem.id !== id);
        setInterviewElems(elems);
    };

    const delDocElemHandler = (id) => {
        const elems = docsComp.filter((elem) => elem.id !== id);
        setDocsComp(elems);
    };

    const delPhotoHandler = (id) => {
        const elems = photoComp.filter((elem) => elem.id !== id);
        setPhotoComp(elems);
    };

    const changeComponentsView = (key, response={}) => {
        switch (key) {
        case 'interview':
            if (!interviewComp) setInterviewComp(!interviewComp);
            break;

        case 'payment':
            if (!paymentComp) setPaymentComp(!paymentComp);
            break;

        case 'docs':
            const docsElems = docsComp.slice();

            // const lastId = (docsElems.length) ? docsElems[docsElems.length - 1].id : 0;
            // docsElems.push({id: lastId + 1, title: `Doc ${lastId + 1}`, url: 'https://уютдома.ru.com/wp-content/uploads/2020/06/7yr5bsawwhm.jpg'});

            docsElems.push({id: response.id, title: response.name, url: `${BACKEND_ADDRESS}${response.url}`});
            setDocsComp(docsElems);
            break;

        case 'photo':
            const photoElems = photoComp.slice();
            photoElems.push({id: response.id, url: `${BACKEND_ADDRESS}${response.url}`});
            // photoElems.push({id: response.id, url: 'http://nl-mail.ru/static/dwoilp3BVjlE.jpg'});
            setPhotoComp(photoElems);
            break;

        default:
            break;
        }
    };

    const addImageToPostFetch = (event) => {
        event.preventDefault();

        // Будет дёргать функцию, которая меняет стайт
        // changeComponentsView('photo');
        postPhoto(event.target.files[0]);
    };

    const addDocToPostFetch = (event) => {
        event.preventDefault();

        // Будет дёргать функцию, которая меняет стайт
        // changeComponentsView('docs');
        postFile(event.target.files[0]);
    };

    const delInterviewComponent = () => {
        setInterviewTitle('');
        setInterviewComp(!interviewComp);
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
            setInterviewError(true);
            return false;
        };

        setInterviewError(false);
        return true;
    };

    const checkBeforFetch = () => {
        if (interviewComp) {
            return checkInterview();
        }
        return true;
    };

    const submitInfo = () => {
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
            payments: [paymentValue],
        };

        if (!form.interviews[0].text.trim()) {
            form = {...form, interviews: []};
        }

        if (!form.payments[0].requisite.trim()) {
            form = {...form, payments: []};
        }

        console.log(form);

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
                    } else {
                        errToast('Пост не был создан');
                    }
                });
        };
    };

    const clearPostForm = () => {
        setInterviewError(false);
        setInterviewElems([]);
        setInterviewType(1);
        setInterviewComp(false);
        setInterviewTitle('');
        setPaymentComp(false);
        setDocsComp([]);
        setPhotoComp([]);
        setPaymentValue({requisite: '', cost: 0, currency: 1});
        document.getElementById('createPostComponentText').value = '';
    };

    const delPaymentComp = () => {
        setPaymentComp(false);
        setPaymentValue({requisite: '', cost: 0, currency: 1});
    };

    return (
        <div className="create-post-component">
            <div className="create-post-component__white-part">
                <div className="create-post-component__white-part__avatar-text">
                    <div className="create-post-component__white-part__avatar-text__avatar"></div>
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
                                onChange={(e) => setInterviewTitle(e.target.value)}
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
                                onChange={(e) => setInterviewType(Number(e.target.value))}>
                                <option value="1">Один вариант ответа</option>
                                <option value="2">Много вариантов ответа</option>
                            </select>
                        </div>
                )}
                {paymentComp && (
                    <PaymentComponent delPaymentComp={delPaymentComp} changePaymentHandler={changePaymentHandler} payVal={paymentValue.requisite}/>
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

                <button className="create-post-component__green-part__buttons_create-post" onClick={() => submitInfo()}>Опубликовать</button>
            </div>
        </div>
    );
}

export default CreatePost;
