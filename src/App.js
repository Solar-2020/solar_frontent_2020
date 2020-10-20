import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import GroupView from './views/GroupView/GroupView';
import Header from './components/HeaderComponent/Header';
import AllGroupsView from './views/AllGroupsView/AllGroupsView';

/**
 * Application root
 * @return {jsx}
 */
function App() {
    // const history  = useHistory();
    // const location = useLocation();

    // useEffect(() => {
    //     if(location.pathname !== 'login') {
    //         if (!authorized) {
    //             history.push('/login');
    //         }
    //     }
    // }, [location]);

    return (
        <BrowserRouter>
            <Header />
            <div className="container">
                <Switch>
                    <Route path={'/'} exact component={GroupView}/>
                    <Route path={'/allgroups'} exact component={AllGroupsView}/>
                    <Route path={'/group/:groupUrl'} component={GroupView}/>
                    <Route render={() => <h1>404: Страница не найдена</h1>} />
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
