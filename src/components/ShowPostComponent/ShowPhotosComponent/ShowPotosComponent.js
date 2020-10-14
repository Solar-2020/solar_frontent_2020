import React from 'react';
import './ShowPhotosComponent.css';

/**
 * Component with photos
 * @param {object} param0 - photos
 * @return {jsx}
 */
function ShowPhotosComponent({photos, backendAddress}) {
    return (
        <div className="show-post-component__white-part__show-photo_container">
            {photos.map((photo) => (
                <div key={photo.id} className="show-post-component__white-part__show-photo-container__img_margin">
                    <a className="not-a" target="_blank" href={`${backendAddress}/${photo.url}`} download>
                        <img src={`${backendAddress}/${photo.url}`} alt={'фото'} className="show-post-component__white-part__show-photo-container__img"></img>
                    </a>
                </div>
            ))}
        </div>
    );
}

export default ShowPhotosComponent;