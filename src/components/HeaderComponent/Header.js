import React from 'react';
import './Header.css';

/**
 * Header component
 * @return {jsx}
 */
function Header() {
    return (
        <div className="header-component">
            <a href="/allgroups" className="header-component__links">Все группы</a>
            <a href="/" className="header-component__links">Главная</a>
        </div>
    );
}

export default Header;
