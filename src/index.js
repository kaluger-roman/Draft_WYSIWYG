import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as serviceWorker from './serviceWorker';
import {applyMiddleware, compose, createStore} from 'redux';
import {Provider} from 'react-redux';
import {rootReducer} from "./redux/rootReducer";
import thunk from 'redux-thunk';
import {ExampleMiddleware} from "./redux/ExampleMiddleware";
import CreateSagaMiddleware from 'redux-saga';
import {sagaWatcher} from "./redux/sagas";
import * as $ from 'jquery';

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


ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


serviceWorker.unregister();
