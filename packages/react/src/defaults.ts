import { Deep } from 'type-core';
import { ReactParams } from './definitions';

export const defaults: Deep.Required<ReactParams> = {
  global: {
    webpack: null
  },
  start: {
    lint: true,
    server: null
  },
  size: {
    limit: null
  }
};
