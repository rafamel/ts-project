import path from 'path';
import { DeepRequired } from 'utility-types';
import { IOptionsTooling } from './types';
import {
  getRoot,
  withDefaults as withDefaultsCommon,
  IOptionsCommon
} from '@riseup/common';
import { merge } from 'merge-strategies';

interface IDefaults<T> {
  common: T & DeepRequired<IOptionsCommon>;
  tooling: T & DeepRequired<IOptionsTooling>;
}

export default function withDefaults<T extends IOptionsTooling>(
  options: T
): IDefaults<T> {
  const paths = options.paths || {};
  const { common } = withDefaultsCommon({
    ...options,
    clean: options.clean || [
      paths.build || path.join(getRoot(options), 'build'),
      paths.docs || path.join(getRoot(options), 'docs'),
      'coverage',
      'CHANGELOG.md'
    ]
  });

  const defaults: DeepRequired<IOptionsTooling> = {
    monorepo: common.monorepo,
    typescript: true,
    clean: common.clean,
    assign: {
      alias: {},
      todo: ['xxx', 'fixme', 'todo', 'refactor']
    },
    paths: {
      ...common.paths,
      build: path.join(common.paths.root, 'build')
    },
    version: {
      docs: true,
      build: true
    },
    extend: {
      babel: [],
      eslint: [],
      jest: [],
      typedoc: []
    }
  };

  const tooling = merge(defaults, options) as T & DeepRequired<IOptionsTooling>;

  return { common, tooling };
}
