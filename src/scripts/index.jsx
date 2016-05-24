import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/';

require('../styles/index.styl');

ReactDOM.render(
  <App />,
  document.getElementById('app-wrapper')
);
