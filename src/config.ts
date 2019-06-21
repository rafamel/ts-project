/* eslint-disable @typescript-eslint/camelcase */
import slim, { envs, fallback } from 'slimconf';
import { levels } from 'loglevel';

export default slim(
  { env: [process.env.NODE_ENV, fallback('development', ['production'])] },
  (on, { env }) => ({
    env,
    publicUrl: envs.get('PUBLIC_URL'),
    logger: on.env({
      defaults: levels.WARN,
      development: levels.TRACE
    }),
    serviceWorker: on.env({
      defaults: false,
      production: true
    })
  })
);
