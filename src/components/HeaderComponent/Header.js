import React, { useEffect, useState } from 'react';
import './Header.css';
import { Link, useLocation, useHistory } from 'react-router-dom';
import logoImg from '../../images/logo2.png';

/**
 * Header component
 * @return {jsx}
 */
function Header({checkAuth, isAuth, cookies, delAuth, userData}) {
    const location = useLocation();
    const history = useHistory();

    const [dropdown, setDropdown] = useState('false');

    useEffect(() => {
        setDropdown(false);
        checkAuth(location, history, cookies);
    }, [location]);

    function exit() {
        cookies.remove('SessionToken', {path: '/', domain: '.develop.pay-together.ru'});
        delAuth();
        history.push('/');
    };

    function Greeting() {
        if (/photos/.test(userData.avatarURL)) {
            return (<img src={userData.avatarURL} className="header-nav-settings__img"/>);
        }
        if (!userData.avatarURL.length) {
            return (<img className="header-nav-settings__img"/>);
        }

        const yandexIn = 'https://avatars.mds.yandex.net/get-yapic/';
        const yandexOut = '/islands-300'
        return (<img src={`${yandexIn}${userData.avatarURL}${yandexOut}`} className="header-nav-settings__img"/>);
    };

    return (
        <div className="header-component-container">
            <div className="header-component-container__content">
                {isAuth ? (
                    <div className="header-component-container__content_padding">
                        <Link to="/">
                            <img src={logoImg} alt="" className="header-component__links_img"/>
                        </Link>
                        <Link to="/allgroups" className="header-component__links">Мои группы</Link>

                        <div className="header-dropdown nav__settings_margin">
                            <div onClick={() => setDropdown(!dropdown)} className="header-nav-settings">
                                {userData.id && (
                                    <Greeting/>
                                )}
                                <div className="header-dropdown__content__down"/>
                            </div>
                            <div className={`header-dropdown__content_${dropdown}`}>
                                <div className="header-dropdown__content__data">
                                    <div className="header-dropdown__content__data-title">{`${userData.name} ${userData.surname}`}</div>
                                    <Link to="/profile" className="header-dropdown__content__data-link">Редактировать</Link>
                                    <div onClick={() => exit()} className="header-dropdown__content__data-exit">Выйти</div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="header-component-container__content_padding">
                        <Link to="/">
                            <img src={logoImg} alt="" className="header-component__links_img"/>
                        </Link>
                        <Link to="/login" className="header-component__links" style={{marginLeft: 'auto'}}>Войти</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
