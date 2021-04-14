import { Deep } from 'type-core';
import { UniversalParams } from './definitions';
import { paths } from './paths';

export const defaults: Deep.Required<UniversalParams> = {
  lintmd: {
    include: './',
    exclude: './{node_modules,pkg,build,dist}/**',
    overrides: {}
  },
  commit: {
    path: paths.commitizen.path
  },
  release: {
    preset: 'angular',
    changelog: true
  }
};
