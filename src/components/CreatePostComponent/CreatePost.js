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

function CreatePost() {
    const initialArr = new Array(3)
        .fill('')
        .map((elem, i) => ({id: i, title: `Elem ${i + 1}`}));

    const [interviewElems, setInterviewElems] = useState(initialArr);
    const [interviewComp, setInterviewComp] = useState(false);
    const [interviewTitle, setInterviewTitle] = useState('');

    const [paymentComp, setPaymentComp] = useState(false);
    const [docsComp, setDocsComp] = useState([]);
    const [photoComp, setPhotoComp] = useState([]);

    const addInterviewElemHandler = (value) => {
        const elems = interviewElems.slice();
        elems.push({id: 10 + 1, title: value});
        setInterviewElems(elems);
    };

    const delInterviewElemHandler = (id) => {
        const elems = interviewElems.filter((elem) => elem.id !== id);
        setInterviewElems(elems);
    };

    const delDocElemHandler = (id) => {
        const elems = docsComp.filter((elem) => elem.id !== id);
        setDocsComp(elems);
    }

    const changeComponentsView = (key) => {
        switch (key) {
        case 'interview':
            if (!interviewComp) setInterviewComp(!interviewComp);
            break;

        case 'payment':
            if (!paymentComp) setPaymentComp(!paymentComp);
            break;

        case 'docs':
            const docsElems = docsComp.slice();

            const lastId = (docsElems.length) ? docsElems[docsElems.length - 1].id : 0;

            docsElems.push({id: lastId + 1, title: `Doc ${lastId + 1}`, url: 'https://уютдома.ru.com/wp-content/uploads/2020/06/7yr5bsawwhm.jpg'});
            setDocsComp(docsElems);
            break;

        case 'photo':
            const photoElems = photoComp.slice();

            const lastPhotoId = (photoElems.length) ? photoElems[photoElems.length - 1].id : 0;

            photoElems.push({id: lastPhotoId + 1, url: 'https://уютдома.ru.com/wp-content/uploads/2020/06/7yr5bsawwhm.jpg'});
            setPhotoComp(photoElems);
            break;

        default:
            break;
        }
    };

    const addImageToPostFetch = (event) => {
        event.preventDefault();

        console.log('image!');
        console.log(event.target.files[0]);

        // Будет дёргать функцию, которая меняет стайт
        postPhoto(event.target.files[0]);
        changeComponentsView('photo');
    }

    const addDocToPostFetch = (event) => {
        event.preventDefault();

        console.log('doc!');
        console.log(event.target.files[0]);

        // Будет дёргать функцию, которая меняет стайт
        postFile(event.target.files[0]);
        changeComponentsView('docs');
    }

    const delInterviewComponent = () => {
        setInterviewTitle('');
        setInterviewElems(initialArr);
        setInterviewComp(!interviewComp);
    };

    const postPhoto = (file) => {
        const formData = new FormData();
        formData.append('body', JSON.stringify({name: file.name}));
        formData.append('file', file);

        fetchModule.Post({
            url: BACKEND_ADDRESS + '/api/upload/photo',
            body: formData,
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((responseBody) => {
                console.log(responseBody);
            });
    };

    const postFile = (file) => {
        const formData = new FormData();
        formData.append('body', JSON.stringify({name: file.name}));
        formData.append('file', file);

        fetchModule.Post({
            url: BACKEND_ADDRESS + '/api/upload/file',
            body: formData,
        })
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((responseBody) => {
                console.log(responseBody);
            });
    }

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
                    <PhotoComponent photos={photoComp}/>
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

                <button className="create-post-component__green-part__buttons_create-post">Опубликовать</button>
            </div>
        </div>
    );
}

export default CreatePost;
