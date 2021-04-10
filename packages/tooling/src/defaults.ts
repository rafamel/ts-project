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
  transpile: {
    types: true,
    output: 'dist/',
    targets: { node: '12.0.0' }
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
