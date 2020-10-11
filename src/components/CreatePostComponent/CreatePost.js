import React, {useState} from 'react';
import InterviewForm from './InterviewComponent/InterviewForm';
import InterviewElements from './InterviewComponent/InterviewElements';
import './CreatePost.css';
import './InterviewComponent/InterviewComp.css';
import PaymentComponent from './PaymentComponent/PaymentComponent';
import DocsComponent from './DocsComponent/DocsComponent';
import PhotoComponent from './PhotoComponet/PhotoComponent';

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

    const delInterviewComponent = () => {
        setInterviewTitle('');
        setInterviewElems(initialArr);
        setInterviewComp(!interviewComp);
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
                    <PhotoComponent photos={photoComp}/>
                )}
                {docsComp.length > 0 && (
                    <DocsComponent docs={docsComp} delDocHandler={delDocElemHandler}/>
                )}

            </div>
            <div className="create-post-component__green-part">
            <button className="create-post-component__green-part__buttons create-post-component__green-part__buttons_photo" onClick={() => changeComponentsView('photo')}></button>
                <button className="create-post-component__green-part__buttons create-post-component__green-part__buttons_survey" onClick={() => changeComponentsView('interview')}></button>
                <button className="create-post-component__green-part__buttons create-post-component__green-part__buttons_payment" onClick={() => changeComponentsView('payment')}></button>
                <button className="create-post-component__green-part__buttons create-post-component__green-part__buttons_doc" onClick={() => changeComponentsView('docs')}></button>
            </div>
        </div>
    );
}

export default CreatePost;
