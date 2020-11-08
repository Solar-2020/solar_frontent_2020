import React, {useReducer} from 'react';
import './ShowPostComponent.css';
import ShowDocsComponent from './ShowDocsComponent.css/ShowDocsComponent';
import ShowPhotosComponent from './ShowPhotosComponent/ShowPotosComponent';
import ShowInterviewComponent from './ShowInterviewComponent/ShowInterviewComponent';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import ShowPaymentComponent from './ShowPaymentComponent/ShowPaymentComponent';
import {createNormDate} from '../../utils/time';

/**
 * Show post component
 * @return {jsx}
 */
function ShowPostComponent({data, cookies}) {
    const initialState = {
        dataComp: data,
        isLightbox: false,
        lightboxImg: '',
    };

    function changeStatus(value) {
        dispatch({type: 'CHANGE_INTERIEW', value});
    };

    function changeField(field, value) {
        dispatch({type: 'CHANGE_FIELD', field, value});
    };

    function openImg(src) {
        changeField('isLightbox', true);
        changeField('lightboxImg', src);
    };

    function closeImg() {
        changeField('isLightbox', false);
        changeField('lightboxImg', '');
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_INTERIEW':
                    //action.value - массив
                    return {...state, dataComp: {... state.dataComp, interviews: action.value}};
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        dataComp,
        isLightbox,
        lightboxImg,
    } = state;

    return (
        <div className="show-post-component">
            {isLightbox && (
                <div
                    onClick={() => closeImg()}
                    className="show-post__lightbox">
                        <img
                        src={lightboxImg} alt={''}
                        className="show-post__lightbox__img"></img>
                </div>
            )}

            <div className="show-post-component__white-part__avatar-text">
                <div className="show-post-component__white-part__avatar-text__avatar"></div>
                <div className="show-post-component__white-part__avatar-text__text">
                    <div className="show-post-component__white-part__avatar-text__text__name">Автор поста</div>
                    <div className="show-post-component__white-part__avatar-text__text__data">{createNormDate(dataComp.publishDate.split('T')[0], dataComp.publishDate.split('T')[1].split('.')[0])}</div>
                </div>
                <button className="show-post-component__white-part__avatar-text__star-button"/>
            </div>
            {dataComp.text && (
                <div className="show-post-component__white-part__post-text">{dataComp.text}</div>
            )}
            {dataComp.interviews.length > 0 && dataComp.interviews[0].answers.length > 0 && (
                <ShowInterviewComponent changeStatus={changeStatus} interview={dataComp.interviews[0]} postId={dataComp.id} cookies={cookies}/>
            )}
            {/* Исправила cost на length */}
            {dataComp.payments.length > 0 && (
                <ShowPaymentComponent payment={dataComp.payments[0]}/>
            )}
            {dataComp.photos.length > 0 && (
                <ShowPhotosComponent photos={dataComp.photos} backendAddress={BACKEND_ADDRESS} openImg={openImg}/>
            )}
            {dataComp.files.length > 0 && (
                <ShowDocsComponent docs={dataComp.files} backendAddress={BACKEND_ADDRESS}/>
            )}
        </div>
    );
}

export default ShowPostComponent;
