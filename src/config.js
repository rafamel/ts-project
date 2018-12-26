import config from 'slimconf';
import { levels as loglevels } from 'loglevel';

const setup = {
  env: {
    default: process.env.NODE_ENV,
    map: (env) => (env === 'production' || env === 'development' ? env : 'test')
  }
};

export default config(setup, ({ env }, on) => ({
  env,
  publicUrl: process.env.PUBLIC_URL || './',
  logger: on.env({
    default: loglevels.WARN,
    development: loglevels.TRACE
  }),
  serviceWorker: on.env({
    default: false,
    production: true
  })
}));
