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
  public: {
    clean: false,
    destination: 'public',
    assets: [],
    fonts: null,
    favicons: {
      logo: paths.riseup.logoNext,
      options: { logging: false } as any
    },
    result: {
      url: null,
      path: 'public/result.json',
      values: null
    }
  },
  explore: {
    dir: '_next'
  },
  size: {
    dir: '_next',
    limit: null
  }
};
