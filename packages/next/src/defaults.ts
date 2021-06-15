import { Deep } from 'type-core';
import { NextParams } from './definitions';

export const defaults: Deep.Required<NextParams> = {
  global: {
    telemetry: false,
    transforms: {
      assets: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ttf', 'eot'],
      styles: ['css', 'scss', 'sass', 'less']
    }
  },
  size: {
    limit: null
  }
};
