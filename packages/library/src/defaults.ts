import { Deep } from 'type-core';
import { LibraryParams } from './definitions';

export const defaults: Deep.Required<LibraryParams> = {
  build: {
    assets: [],
    types: true,
    tarball: false,
    destination: 'pkg/',
    targets: { node: '12.0.0' },
    multitarget: true,
    manifest: {}
  },
  docs: {
    build: true,
    name: null,
    version: null,
    destination: 'docs/',
    overrides: {}
  },
  distribute: {
    push: true,
    contents: 'pkg/'
  }
};
