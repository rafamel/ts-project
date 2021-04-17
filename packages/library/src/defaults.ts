import { Deep } from 'type-core';
import { LibraryParams } from './definitions';

export const defaults: Deep.Required<LibraryParams> = {
  build: {
    assets: [],
    nodev: true,
    tarball: false,
    multitarget: true,
    destination: 'pkg/',
    manifest: {}
  },
  distribute: {
    push: true,
    contents: 'pkg/'
  },
  docs: {
    build: true,
    name: null,
    version: null,
    destination: 'docs/',
    overrides: {}
  }
};
