import React, { useReducer, useEffect } from 'react';
import {BrowserRouter, Route, Switch, useLocation, Redirect, useHistory} from 'react-router-dom';
import GroupView from './views/GroupView/GroupView';
import Header from './components/HeaderComponent/Header';
import AllGroupsView from './views/AllGroupsView/AllGroupsView';
import IndexView from './views/IndexView/IndexView';
import LoginView from './views/LoginView/LoginView';
import RegistrationView from './views/RegistrationView/RegistrationView';

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
                checkProfile();
            }
        } else {
            if (isAuth) {
                // return <Redirect to="/"/>
                history.push('/');
            }
        }
    };

    function checkProfile() {
        changeField('isAuth', true);
        changeField('userData', {id: 10, name: 'Ben'});

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
