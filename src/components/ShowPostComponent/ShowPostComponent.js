import React, {useState} from 'react';
import './ShowPostComponent.css';
import ShowDocsComponent from './ShowDocsComponent.css/ShowDocsComponent';
import ShowPhotosComponent from './ShowPhotosComponent/ShowPotosComponent';
import ShowInterviewComponent from './ShowInterviewComponent/ShowInterviewComponent';
import {BACKEND_ADDRESS} from '../../utils/Config/Config.js';

/**
 * Show post component
 * @return {jsx}
 */
function ShowPostComponent({data}) {
    const [dataComp, setDataComp] = useState(data);

    return (
        <div className="show-post-component">
            <div className="show-post-component__white-part__avatar-text">
                <div className="show-post-component__white-part__avatar-text__avatar"></div>
                <div className="show-post-component__white-part__avatar-text__text">
                    <div className="show-post-component__white-part__avatar-text__text__name">Автор поста</div>
                    <div className="show-post-component__white-part__avatar-text__text__data">{dataComp.publishDate.split('T')[0]}</div>
                </div>
                <button className="show-post-component__white-part__avatar-text__star-button"/>
            </div>
            {dataComp.text && (
                <div className="show-post-component__white-part__post-text">{dataComp.text}</div>
            )}
            {dataComp.interviews[0].answers.length > 0 && (
                <ShowInterviewComponent interview={dataComp.interviews[0]}/>
            )}
            {dataComp.photos.length > 0 && (
                <ShowPhotosComponent photos={dataComp.photos} backendAddress={BACKEND_ADDRESS}/>
            )}
            {dataComp.files.length > 0 && (
                <ShowDocsComponent docs={dataComp.files} backendAddress={BACKEND_ADDRESS}/>
            )}
        </div>
    );
}

export default ShowPostComponent;
