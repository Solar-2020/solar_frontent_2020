import React, {useReducer} from 'react';
import './ShowPostComponent.css';
import ShowDocsComponent from './ShowDocsComponent.css/ShowDocsComponent';
import ShowPhotosComponent from './ShowPhotosComponent/ShowPotosComponent';
import ShowInterviewComponent from './ShowInterviewComponent/ShowInterviewComponent';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';
import fetchModule from '../../utils/API/FetchModule';
import ShowPaymentComponent from './ShowPaymentComponent/ShowPaymentComponent';
import {createNormDate} from '../../utils/time';

/**
 * Show post component
 * @return {jsx}
 */
function ShowMarkedPost({data, cookies, roleID, okToast, errToast, deletePost, deletePostComp}) {
    const initialState = {
        dataComp: data,
        isLightbox: false,
        lightboxImg: '',

        dropdown: false,
    };

    function changeStatus(value) {
        dispatch({type: 'CHANGE_INTERIEW', value});
    };

    function changeMarked(value) {
        dispatch({type: 'CHANGE_MARKED', value});
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
                case 'CHANGE_MARKED':
                    return {...state, dataComp: {...state.dataComp, marked: action.value}};
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
        dropdown,
    } = state;

    function setMarked() {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/posts/mark?groupId=${dataComp.groupID}&marked=${!dataComp.marked}&postId=${dataComp.id}`,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    changeMarked(!dataComp.marked);
                    deletePostComp(dataComp.id);
                    console.log('marked');
                    okToast('Статус поста изменён');
                } else {
                    errToast('Что-то пошло не по плану ...');
                }
            });
    };

    function Greeting({avatar}) {
        if (/photos/.test(avatar)) {
            return (<img src={avatar} className="show-post-component__white-part__avatar-text__avatar"/>);
        }
        if (!avatar.length) {
            return (<img className="show-post-component__white-part__avatar-text__avatar"/>);
        }

        const yandexIn = 'https://avatars.mds.yandex.net/get-yapic/';
        const yandexOut = '/islands-300'
        return (<img src={`${yandexIn}${avatar}${yandexOut}`} className="show-post-component__white-part__avatar-text__avatar"/>);
    };

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
                {dataComp.author && (
                    <Greeting avatar={dataComp.author.avatarURL}/>
                )}

                <div className="show-post-component__white-part__avatar-text__text">
                    <div className="show-post-component__white-part__avatar-text__text__name">{`${dataComp.author.name} ${dataComp.author.surname}`}</div>
                    <div className="show-post-component__white-part__avatar-text__text__data">{createNormDate(dataComp.publishDate.split('T')[0], dataComp.publishDate.split('T')[1].split('.')[0])}</div>
                </div>
                
                {roleID !== 3 ? (
                    <div className="show-post-component__white-part__avatar-text__star-button_margin">
                        <div className="dropdown nav__settings_margin">
                            <div onClick={() => changeField('dropdown', !dropdown)} className="nav__settings"></div>
                            <div className={`dropdown-content_${dropdown}`}>
                                <div onClick={() => deletePost(dataComp.id)}>Удалить пост</div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setMarked()}
                            className={`show-post-component__white-part__avatar-text__star-button_${dataComp.marked}`}/>
                    </div>
                ): (
                    <button className={`show-post-component__white-part__avatar-text__star-button_${dataComp.marked}-user`}/>
                )}
            </div>
            {dataComp.text && (
                <div className="show-post-component__white-part__post-text">{dataComp.text}</div>
            )}
            {dataComp.interviews.length > 0 && dataComp.interviews[0].answers.length > 0 && (
                <ShowInterviewComponent changeStatus={changeStatus} interview={dataComp.interviews[0]} postId={dataComp.id} cookies={cookies}/>
            )}
            {/* Исправила cost на length */}
            {dataComp.payments.length > 0 && (
                <ShowPaymentComponent payment={dataComp.payments[0]} cookies={cookies}/>
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

export default ShowMarkedPost;
