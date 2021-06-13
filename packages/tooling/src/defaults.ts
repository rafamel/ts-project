import { Deep } from 'type-core';
import { ToolingParams } from './definitions';

export const defaults: Deep.Required<ToolingParams> = {
  global: {
    prettier: true,
    alias: {},
    transforms: {
      assets: [],
      styles: []
    },
    extensions: {
      js: ['js', 'jsx', 'cjs', 'mjs'],
      ts: ['ts', 'tsx']
    }
  },
  fix: {
    dir: ['src/', 'test/']
  },
  lint: {
    dir: ['src/', 'test/'],
    types: true,
    highlight: ['fixme', 'todo', 'refactor'],
    rules: {}
  },
  test: {
    verbose: false,
    ignore: [],
    require: [],
    coverage: 'auto',
    threshold: null,
    overrides: {}
  }
};
