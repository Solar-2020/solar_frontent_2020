import React, { useReducer, useEffect } from 'react';
import {BrowserRouter, Route, Switch, useLocation, Redirect, useHistory} from 'react-router-dom';
import GroupView from './views/GroupView/GroupView';
import Header from './components/HeaderComponent/Header';
import AllGroupsView from './views/AllGroupsView/AllGroupsView';
import IndexView from './views/IndexView/IndexView';
import LoginView from './views/LoginView/LoginView';
import RegistrationView from './views/RegistrationView/RegistrationView';
import fetchModule from './utils/API/FetchModule.js';
import {BACKEND_ADDRESS} from './utils/Config/Config.js';
import { withCookies } from 'react-cookie'
import LoginYandex from './views/LoginYandex/LoginYandex';
import PayView from './views/PayView/PayView';
import ErrorPopUp from './components/ErrorPopUp/ErrorPopUp';

/**
 * Application root
 * @return {jsx}
 */
function App({cookies}) {
    // const history  = useHistory();
    // const location = useLocation();

    // useEffect(() => {
    //     cookies.set('name', 'Ross', { path: '/' });
    // }, []);

    function changeField(field, value) {
        dispatch({ type: 'CHANGE_FIELD', field, value });
    };

    const initialState = {
        isAuth: false,
        userData: {},
    };

    const [state, dispatch] = useReducer(
        (state, action) => {
            switch (action.type) {
                case 'CHANGE_FIELD':
                    return {...state, [action.field]: action.value};
                default:
                    return state;
            }
        },
        initialState
    );

    const {
        isAuth,
        userData,
    } = state;

    function checkAuth(location, history, cookies) {
        // console.log('----');
        // console.log(location);
        // console.log(isAuth);
        // console.log(userData);
        if (location.pathname.includes('/yandexoauth')) return;

        if (location.pathname !== '/login' && location.pathname !== '/registration') {
            if (!isAuth) {
                checkProfile(location, history, cookies);
            }
        } else {
            // надо доработать, чтобудет, если зайдут сразу с login
            if (isAuth) {
                // return <Redirect to="/"/>
                history.push('/');
            }
        }
    };

    function checkProfile(location, history, cookies) {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/api/account/by-cookie`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookies.get('SessionToken'),
            },
        })
            .then((response) => {
                if (response.ok) {
                    changeField('isAuth', true);
                } else if (location.pathname !== '/') {
                    changeField('isAuth', false);
                    history.push('/login');
                } else {
                    changeField('isAuth', false);
                };
            });    
         // при неудаче редирект на логин, если это не location ='/'
    }

    function delAuth() {
        changeField('isAuth', false);
    };

    return (
        <BrowserRouter>
            <Header checkAuth={checkAuth} isAuth={isAuth} cookies={cookies} delAuth={delAuth}/>
            <div className="container">
                <Switch>
                    <Route path={'/'} exact render={() => (<IndexView cookies={cookies}/>)}/>
                    <Route path={'/login'} exact render={() => (<LoginView cookies={cookies}/>)}/>
                    <Route path={'/registration'} exact render={() => (<RegistrationView cookies={cookies}/>)}/>
                    <Route path={'/allgroups'} exact render={() => (<AllGroupsView cookies={cookies}/>)}/>
                    <Route path={'/yandexoauth'} render={() => (<LoginYandex cookies={cookies}/>)}/>
                    <Route path={'/pay'} render={() => (<PayView cookies={cookies}/>)}/>
                    <Route path={'/group/:groupUrl'} render={() => (<GroupView cookies={cookies}/>)}/>
                    <Route path={'/servererror'} exact render={() => (<ErrorPopUp/>)}/>
                    <Route render={() => <h1>404: Страница не найдена</h1>} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default withCookies(App);
