// Fonts & Styles

// React and SW
import React from 'react';
import ReactDOM from 'react-dom';
import App from '~/App';
import sw from '~/utils/sw';

// Config & HMR
import config from '~/config';
import logger from '~/utils/logger';

// Render
config.get('serviceWorker') ? sw.register() : sw.unregister();
ReactDOM.render(<App />, document.getElementById('root'));

logger.info(`Running on ${config.get('env')}`);
