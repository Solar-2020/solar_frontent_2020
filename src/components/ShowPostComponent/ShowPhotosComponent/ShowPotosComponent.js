import React from 'react';
import './ShowPhotosComponent.css';

/**
 * Component with photos
 * @param {object} param0 - photos
 * @return {jsx}
 */
function ShowPhotosComponent({photos, backendAddress, openImg}) {
    return (
        <div className="show-post-component__white-part__show-photo_container">
            {photos.map((photo) => (
                <div key={photo.id} className="show-post-component__white-part__show-photo-container__img_margin">
                    <img
                        onClick={() => openImg(`${backendAddress}/${photo.url}`)}
                        src={`${backendAddress}/${photo.url}`} alt={''}
                        className="show-post-component__white-part__show-photo-container__img"></img>
                </div>
            ))}
        </div>
    );
}

export default ShowPhotosComponent;
