/* eslint-disable @typescript-eslint/camelcase */
import slim, { fallback, IUse } from 'slimconf';
import { levels as loglevels } from 'loglevel';

const use: IUse = {
  env: [process.env.NODE_ENV, fallback('development', ['production', 'test'])]
};

export default slim(use, (on, { env }) => ({
  env,
  publicUrl: process.env.PUBLIC_URL || './',
  logger: on.env({
    defaults: loglevels.WARN,
    development: loglevels.TRACE
  }),
  serviceWorker: on.env({
    defaults: false,
    production: true
  }),
  manifest: {
    name: process.env.MANIFEST_NAME,
    short_name: process.env.MANIFEST_SHORT_NAME,
    description: process.env.MANIFEST_DESCRIPTION
  }
}));
