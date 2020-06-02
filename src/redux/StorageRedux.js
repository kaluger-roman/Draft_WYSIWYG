import CreateSagaMiddleware from "redux-saga";
import {applyMiddleware, compose, createStore} from "redux";
import {rootReducer} from "./Reducers/rootReducer";
import thunk from "redux-thunk";
import {ExampleMiddleware} from "./MIDDLEWARES/ExampleMiddleware";
import {sagaWatcher} from "./SAGA/sagas";
import {sagaWatcherDraft} from "../components/CommonComps/Service&SAGA/DRAFT_MAIN_SAGA_WATCHER";


const  saga=CreateSagaMiddleware();


const devTools = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__();//process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() : null;

export const store=createStore(rootReducer, compose(
    applyMiddleware(
        thunk,
        ExampleMiddleware,
        saga,
    ),
    devTools
));

saga.run(sagaWatcher);
saga.run(sagaWatcherDraft);

