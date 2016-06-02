import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/';
import configureStore from './utils/configureStore';

const css = require('../styles/index.styl');
const appStore = configureStore();

ReactDOM.render(
  <Provider store={appStore}>
    <App />
  </Provider>,
  document.getElementById('app-wrapper')
);
