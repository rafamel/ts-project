// Shims/Polyfills
import '@babel/polyfill';
// import 'whatwg-fetch';

// Fonts & Styles
import 'typeface-roboto';
import 'normalize.css';

// React and SW
import React from 'react';
import ReactDOM from 'react-dom';
import App from '~/containers/App';
import sw from 'sw';

// Contexts
import { Provider } from 'cxt';
import contexts from './contexts';

// Config & HMR
import config from '~/config';
import logger from 'logger';

// Run all
config.get('serviceWorker') ? sw.register() : sw.unregister();
ReactDOM.render(
  <Provider value={contexts.root}>
    <App />
  </Provider>,
  document.getElementById('root')
);

logger.info(`Running on ${config.get('env')}`);
