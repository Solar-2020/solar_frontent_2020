import React from 'react';
import './IndexView.css';

/**
 * Index view
 * @return {jsx}
 */
function IndexView() {
    return (
        <div className="index-view-container">
            <div className="index-view-container_img">
                <div className="index-text_light">ДОБРО ПОЖАЛОВАТЬ</div>
                <div className="index-text_light">В <span className="index-text_bold">PAY-TOGETHER</span></div>
            </div>
            <div className="index-view-container_img_content">
                <div className="index-view-container_img-white"></div>
            </div>
        </div>
    );
}

export default IndexView;