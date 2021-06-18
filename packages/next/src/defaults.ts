import { Deep } from 'type-core';
import { NextParams } from './definitions';
import { paths } from './paths';

export const defaults: Deep.Required<NextParams> = {
  global: {
    telemetry: false,
    stubs: {
      identity: ['css', 'scss', 'sass', 'less'],
      route: ['ttf', 'eot'],
      image: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg']
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
  favicons: {
    logo: paths.riseup.logoNext,
    urls: {
      assets: null,
      result: '/vendor/favicons'
    },
    dest: {
      assets: 'public/vendor/favicons',
      result: 'public/vendor/favicons-result.json'
    },
    favicons: { logging: false } as any
  },
  size: {
    dir: '_next',
    limit: null
  }
};
