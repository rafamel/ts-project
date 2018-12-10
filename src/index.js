// Shims/Polyfills
import 'babel-polyfill';
// import 'whatwg-fetch';

// Fonts & Styles
import 'typeface-roboto';
import 'normalize.css';

// React and SW
import React from 'react';
import ReactDOM from 'react-dom';
import App from '~/containers/App';
import serviceWorker from 'sw';

// Contexts
import { Provider } from 'cxt';
import contexts from './contexts';

// Config & HMR
import config from '~/config';
import logger from 'logger';
import hmr from 'hmr';

// Run all
serviceWorker();
const render = (Component) => {
  ReactDOM.render(
    <Provider value={contexts.root}>
      <Component />
    </Provider>,
    document.getElementById('root')
  );
};
render(App);

logger.info(`Running on ${config.get('env')}`);
if (config.get('hmr')) hmr(render, module.hot && module.hot.accept);
