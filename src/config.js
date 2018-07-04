import { levels as loglevels } from 'loglevel';
const e = process.env.NODE_ENV;
const env = e === 'production' || e === 'development' ? e : 'test';
const onEnv = (obj) => (obj.hasOwnProperty(env) ? obj[env] : obj.default);

export default {
  publicUrl: process.env.PUBLIC_URL || './',
  env: {
    production: env === 'production',
    development: env === 'development',
    test: env === 'test'
  },
  logger: onEnv({
    default: loglevels.WARN,
    development: loglevels.TRACE
  }),
  serviceWorker: onEnv({
    default: false,
    production: true
  })
};
