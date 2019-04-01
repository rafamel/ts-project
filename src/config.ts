/* eslint-disable @typescript-eslint/camelcase */
import slim from 'slimconf';
import { levels as loglevels } from 'loglevel';

const setup = {
  env: {
    from: process.env.NODE_ENV,
    map: (env: string) =>
      env === 'production' || env === 'development' ? env : 'test'
  }
};

export default slim(setup, ({ env }, on) => ({
  env,
  publicUrl: process.env.PUBLIC_URL || './',
  logger: on.env({
    default: loglevels.WARN,
    development: loglevels.TRACE
  }),
  serviceWorker: on.env({
    default: false,
    production: true
  }),
  manifest: {
    name: process.env.MANIFEST_NAME,
    short_name: process.env.MANIFEST_SHORT_NAME,
    description: process.env.MANIFEST_DESCRIPTION
  }
}));
