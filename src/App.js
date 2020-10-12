import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import GroupView from './views/GroupView/GroupView';
import Header from './components/Header';

/**
 * Application root
 * @return {jsx}
 */
function App() {
    return (
        <BrowserRouter>
            <Header />
            <div className="container">
                <Switch>
                    <Route path={'/'} exact component={GroupView}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
