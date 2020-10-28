import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';

/**
 * Header component
 * @return {jsx}
 */
function Header() {
    return (
        <div className="header-component-container">
            <div className="header-component-container__content">
                <div className="header-component-container__content_padding">
                    <Link to="/allgroups" className="header-component__links">Все группы</Link>
                    <Link to="/" className="header-component__links">Главная</Link>
                    <Link to="/group/39" className="header-component__links">Группа 39</Link>
                    <Link to="/login" className="header-component__links">Авторизация</Link>
                </div>
            </div>
        </div>
    );
}

export default Header;
