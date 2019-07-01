/* eslint-disable @typescript-eslint/camelcase */
import slim, { envs, fallback } from 'slimconf';
import { levels } from 'loglevel';

export default slim(
  { env: [process.env.NODE_ENV, fallback('development', ['production'])] },
  (on, { env }) => ({
    env,
    publicUrl: envs.get('PUBLIC_URL'),
    logger: on.env({
      default: levels.WARN,
      development: levels.TRACE
    }),
    serviceWorker: on.env({
      default: false,
      production: true
    }),
    manifest: {
      name: envs.get('REACT_APP_NAME'),
      short_name: envs.get('REACT_APP_SHORT_NAME'),
      description: envs.get('REACT_APP_DESCRIPTION')
    },
    breakpoints: {
      xs: envs.get('REACT_APP_XS'),
      sm: envs.get('REACT_APP_SM'),
      md: envs.get('REACT_APP_MD'),
      lg: envs.get('REACT_APP_LG'),
      xl: envs.get('REACT_APP_XL')
    },
    services: {
      graphql: process.env.REACT_APP_GRAPHQL_ENDPOINT
    }
  })
);
