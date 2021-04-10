import { Deep } from 'type-core';
import { LibraryParams } from './definitions';

export const defaults: Deep.Required<LibraryParams> = {
  build: {
    assets: [],
    tarball: false,
    multitarget: true,
    destination: 'pkg/'
  },
  docs: {
    build: true,
    name: null,
    version: null,
    destination: 'docs/',
    overrides: {}
  }
};
