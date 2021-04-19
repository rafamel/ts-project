import { Deep } from 'type-core';
import { ToolingParams } from './definitions';

export const defaults: Deep.Required<ToolingParams> = {
  global: {
    alias: {},
    extensions: {
      js: ['js', 'jsx'],
      ts: ['ts', 'tsx']
    }
  },
  lint: {
    dir: ['./'],
    types: true,
    prettier: true,
    highlight: ['fixme', 'todo', 'refactor'],
    rules: {}
  },
  test: {
    overrides: {}
  }
};
