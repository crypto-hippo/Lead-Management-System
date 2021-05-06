import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './components/Login'
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';
import configureStore from './store';
import './scss/index.scss';


ReactDOM.render(
    <Provider store={configureStore()}>
        <App />
        
    </Provider>,
    document.getElementById('root')
);




