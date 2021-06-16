import { Deep } from 'type-core';
import { NextParams } from './definitions';

export const defaults: Deep.Required<NextParams> = {
  global: {
    telemetry: false,
    stubs: {
      assets: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'ttf', 'eot'],
      styles: ['css', 'scss', 'sass', 'less']
    }
  },
  watch: {
    clear: true,
    include: ['./'],
    exclude: [
      'node_modules',
      'coverage',
      'test',
      'public',
      'out',
      'build',
      '.next'
    ]
  },
  size: {
    limit: null
  }
};
