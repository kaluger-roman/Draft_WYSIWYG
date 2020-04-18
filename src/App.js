import React, {useEffect} from 'react';
import RouteConstants from './Routing/ROUTECONSTANTS'
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
} from "react-router-dom";
import MainPanel from "./components/CommonComps/mainpanel";
import Floor from "./components/CommonComps/floor";
import {useDispatch, useSelector} from "react-redux";
import {ScrollUndefindAction} from "./redux/actions";
import HelpMessanging from "./components/CommonComps/HelpMessanging";
import ConstructorApp from "./components/ConstructorComponents/ConstructorApp";
import MainPageContentContainer from "./components/componentsformainpage/MainPageContentContainer";


function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        window.addEventListener('scroll', function f1() {
                dispatch(ScrollUndefindAction());
                return function cleanup() {
                    window.removeEventListener('scroll', f1);
                };
            }
        );
    });
    return (
        <Router>
            <div className="App container-fluid p-0 m-0">
                <MainPanel/>
                <Switch>
                    <Route exact path={RouteConstants.HOME}>
                        <MainPageContentContainer/>
                    </Route>
                    <Route path={RouteConstants.CONSTRUCTOR}>
                        <ConstructorApp/>
                    </Route>
                    <Route path="*">
                        <Redirect to={RouteConstants.HOME}/>
                    </Route>
                </Switch>
                <Floor/>
                <HelpMessanging/>
            </div>
        </Router>
    );
}

export default App;
