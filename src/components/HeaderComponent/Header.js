import React, { useEffect } from 'react';
import './Header.css';
import { Link, useLocation, useHistory } from 'react-router-dom';

/**
 * Header component
 * @return {jsx}
 */
function Header({checkAuth, isAuth}) {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        checkAuth(location, history);
    }, [location]);

    return (
        <div className="header-component-container">
            <div className="header-component-container__content">
                {isAuth ? (
                    <div className="header-component-container__content_padding">
                        <Link to="/allgroups" className="header-component__links">Мои группы</Link>
                        <Link to="/" className="header-component__links">Главная</Link>
                        <Link to="/group/39" className="header-component__links">Группа 39</Link>
                    </div>
                ) : (
                    <div className="header-component-container__content_padding">
                        <Link to="/" className="header-component__links">Главная</Link>
                        <Link to="/login" className="header-component__links">Авторизация</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
