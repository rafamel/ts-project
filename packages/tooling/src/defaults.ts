import { Deep } from 'type-core';
import { ToolingParams } from './definitions';

export const defaults: Deep.Required<ToolingParams> = {
  global: {
    prettier: true,
    alias: {},
    extensions: {
      js: ['js', 'jsx', 'cjs', 'mjs'],
      ts: ['ts', 'tsx'],
      assets: [],
      styles: []
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
    require: [],
    overrides: {}
  },
  coverage: {
    all: true,
    threshold: 0,
    overrides: {}
  }
};
