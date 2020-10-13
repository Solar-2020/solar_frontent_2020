import React, {useState} from 'react';
import InterviewForm from './InterviewComponent/InterviewForm';
import InterviewElements from './InterviewComponent/InterviewElements';
import './CreatePost.css';
import './InterviewComponent/InterviewComp.css';
import PaymentComponent from './PaymentComponent/PaymentComponent';
import DocsComponent from './DocsComponent/DocsComponent';
import PhotoComponent from './PhotoComponet/PhotoComponent';
import fetchModule from '../../utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Create post component
 * @return {jsx}
 */
function CreatePost() {
    const [interviewElems, setInterviewElems] = useState([]);
    const [interviewComp, setInterviewComp] = useState(false);
    const [interviewTitle, setInterviewTitle] = useState('');

    const [paymentComp, setPaymentComp] = useState(false);
    const [docsComp, setDocsComp] = useState([]);
    const [photoComp, setPhotoComp] = useState([]);

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

            docsElems.push({id: response.id, title: response.name, url: `${BACKEND_ADDRESS}/${response.url}`});
            setDocsComp(docsElems);
            break;

        case 'photo':
            const photoElems = photoComp.slice();
            photoElems.push({id: response.id, url: `${BACKEND_ADDRESS}/${response.url}`});
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
                changeComponentsView('photo', responseBody);
            });
    };

    const postFile = (file) => {
        const formData = new FormData();
        formData.append('body', JSON.stringify({name: file.name}));
        formData.append('file', file);

        fetchModule.post({
            url: BACKEND_ADDRESS + '/api/upload/file',
            body: formData,
        })
            .then((response) => {
                return response.json();
            })
            .then((responseBody) => {
                if (!responseBody.id || !responseBody.url) {
                    alert('Искать ошибку в запросе для создания документа');
                }
                changeComponentsView('docs', responseBody);
            });
    };

    const submitInfo = () => {
        const form = {
            groupID: 1,
            text: document.getElementById('createPostComponentText').value,
            interviews: [
                {
                    text: interviewTitle,
                    type: 1,
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
                    cost: 300,
                    currency: 1,
                },
            ],
        };

        fetchModule.post({
            url: BACKEND_ADDRESS + '/api/posts/post',
            body: JSON.stringify(form),
            header: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((responseBody) => {
                // if (!responseBody.id || !responseBody.url) {
                //     alert('Искать ошибку в запросе для отправки поста');
                // }
                alert('Успешно отправлен пост!');
                clearPostForm();
            });
    };

    const clearPostForm = () => {
        setInterviewElems([]);
        setInterviewComp(false);
        setInterviewTitle('');
        setPaymentComp(false);
        setDocsComp([]);
        setPhotoComp([]);
        document.getElementById('createPostComponentText').value = '';
    };

    return (
        <div className="create-post-component">
            <div className="create-post-component__white-part">
                <div className="create-post-component__white-part__avatar-text">
                    <div className="create-post-component__white-part__avatar-text__avatar"></div>
                    <textarea id="createPostComponentText" className="create-post-component__white-part__avatar-text__text"></textarea>
                </div>
                {interviewComp && (
                    <div className="create-post-component__white-part__interview-container">
                        <div className="create-post-component__white-part__interview-container__title">Тема опроса</div>
                        <div className="create-post-component__white-part__interview-container__title__input-container">
                            <input
                                type="text"
                                placeholder="Введите название опроса"
                                value={interviewTitle}
                                onChange={(e) => setInterviewTitle(e.target.value)}
                                className="create-post-component__white-part__interview-container__title__input-container__input"
                            />
                            <button className="create-post-component__white-part__interview-container__title__input-container__button" onClick={() => delInterviewComponent()}></button>
                        </div>
                        <InterviewElements interviewElems={interviewElems} delHandler={delInterviewElemHandler}/>
                        <InterviewForm addHandler={addInterviewElemHandler}/>
                    </div>
                )}
                {paymentComp && (
                    <PaymentComponent delPaymentComp={() => setPaymentComp(false)}/>
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
                    id="createPostComponentGreenPartPhoto"
                    value="photo"
                    className="create-post-component__green-part__buttons create-post-component__green-part__buttons_photo"
                    onClick={() => document.getElementById('createPostComponentGreenPartAddPhoto').click()}/>
                <input
                    id="createPostComponentGreenPartAddPhoto"
                    style={{display: 'none'}}
                    type="file" name="addPostPhoto" accept="image/png, image/jpeg, image/gif"
                    onChange={addImageToPostFetch}/>

                <button className="create-post-component__green-part__buttons create-post-component__green-part__buttons_survey" onClick={() => changeComponentsView('interview')}/>
                <button className="create-post-component__green-part__buttons create-post-component__green-part__buttons_payment" onClick={() => changeComponentsView('payment')}/>

                <button
                    id="createPostComponentGreenPartDocAdd"
                    value="doc"
                    onClick={() => document.getElementById('createPostComponentGreenPartDoc').click()}
                    className="create-post-component__green-part__buttons create-post-component__green-part__buttons_doc"/>
                <input
                    id="createPostComponentGreenPartDoc"
                    style={{display: 'none'}}
                    type="file" name="addPostDoc" accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                    onChange={addDocToPostFetch}/>

                <button className="create-post-component__green-part__buttons_create-post" onClick={() => submitInfo()}>Опубликовать</button>
            </div>
        </div>
    );
}

export default CreatePost;