import React from 'react';
import './PhotoComponent.css';

/**
 * Component with photos
 * @param {object} param0 - photos
 * @return {jsx}
 */
function PhotoComponent({photos}) {
    return (
        <div className="create-post-component__white-part__photo_container">
            {photos.map((photo) => (
                <div key={photo.id} className="create-post-component__white-part__photo-container__img_margin">
                    <img src={photo.url} alt={'фото'} className="create-post-component__white-part__photo-container__img"></img>
                </div>
            ))}
        </div>
    );
}

export default PhotoComponent;
