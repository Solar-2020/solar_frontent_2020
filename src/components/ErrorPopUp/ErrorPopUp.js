import React from 'react';
import './ErrorPopUp.css';
import errImg from '../../images/errorserver.jpg';

/**
 * Header component
 * @return {jsx}
 */
function ErrorPopUp() {
   
    return (
        <div className="login-view-container">
                <div className="error-pop-up__title">Ой, 500...</div>
                <div className="error-pop-up__text">Повторите запланированные здействия позже</div>
                <img src={errImg} alt="" className="error-pop-up__img"></img>
        </div>
    );
}

export default ErrorPopUp;
