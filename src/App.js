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

/**
 * Application root
 * @return {jsx}
 */
function App() {
    // const history  = useHistory();
    // const location = useLocation();

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

    function checkAuth(location, history) {
        // console.log('----');
        // console.log(location);
        // console.log(isAuth);
        // console.log(userData);

        if (location.pathname !== '/login' && location.pathname !== '/registration') {
            if (!isAuth) {
                checkProfile(location, history);
            }
        } else {
            // надо доработать, чтобудет, если зайдут сразу с login
            if (isAuth) {
                // return <Redirect to="/"/>
                history.push('/');
            }
        }
    };

    function checkProfile(location, history) {
        fetchModule.get({
            url: BACKEND_ADDRESS + `/group/list`,
            body: null,
            headers: {
                'Content-Type': 'application/json',
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

    return (
        <BrowserRouter>
            <Header checkAuth={checkAuth} isAuth={isAuth}/>
            <div className="container">
                <Switch>
                    <Route path={'/'} exact component={IndexView}/>
                    <Route path={'/login'} exact component={LoginView}/>
                    <Route path={'/registration'} exact component={RegistrationView}/>
                    <Route path={'/allgroups'} exact component={AllGroupsView}/>
                    <Route path={'/group/:groupUrl'} component={GroupView}/>
                    <Route render={() => <h1>404: Страница не найдена</h1>} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
