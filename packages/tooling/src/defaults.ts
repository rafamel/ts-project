import { Deep } from 'type-core';
import { ToolingParams } from './definitions';

export const defaults: Deep.Required<ToolingParams> = {
  global: {
    prettier: true,
    alias: {},
    extensions: {
      js: ['js', 'jsx'],
      ts: ['ts', 'tsx']
    }
  },
  fix: {
    dir: ['./']
  },
  lint: {
    dir: ['./'],
    types: true,
    highlight: ['fixme', 'todo', 'refactor'],
    rules: {}
  },
  test: {
    overrides: {}
  }
};
