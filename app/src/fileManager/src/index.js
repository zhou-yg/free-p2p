import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import MainReducer from './Reducers/MainReducer'
import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.css';
import config from './config';
import {api} from '../../common/api';

export default function render (root) {

    const store = createStore(MainReducer, applyMiddleware(thunk));
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        root
    );

    api.onError((e) => {
      store.dispatch({
        type: 'SET_ERROR',
        value: e,
      });
    });

    return store;
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.register();
