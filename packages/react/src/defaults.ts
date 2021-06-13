import { Deep } from 'type-core';
import { ReactParams } from './definitions';

export const defaults: Deep.Required<ReactParams> = {
  global: {
    webpack: null,
    transforms: {
      assets: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'],
      styles: ['css', 'scss', 'sass', 'less']
    }
  },
  start: {
    lint: true,
    server: null
  },
  size: {
    limit: null
  }
};
