import React, { useEffect } from 'react';
import './Header.css';
import { Link, useLocation, useHistory } from 'react-router-dom';

/**
 * Header component
 * @return {jsx}
 */
function Header({checkAuth, isAuth, cookies, delAuth}) {
    const location = useLocation();
    const history = useHistory();

    useEffect(() => {
        checkAuth(location, history, cookies);
    }, [location]);

    function exit() {
        cookies.remove('SessionToken', {path: '/', domain: '.develop.pay-together.ru'});
        delAuth();
        history.push('/');
    };

    return (
        <div className="header-component-container">
            <div className="header-component-container__content">
                {isAuth ? (
                    <div className="header-component-container__content_padding">
                        <Link to="/" className="header-component__links">Главная</Link>
                        <Link to="/allgroups" className="header-component__links">Мои группы</Link>
                        <Link to="/profile" className="header-component__links">Профиль</Link>
                        {/* <Link to="/group/39" className="header-component__links">Группа 39</Link> */}
                        <div onClick={() => exit()} className="header-component__links header-component__links_margin ">Выйти</div>
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
