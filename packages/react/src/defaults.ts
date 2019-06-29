import path from 'path';
import { DeepRequired } from 'utility-types';
import {
  withDefaults as withDefaultsTooling,
  IOptionsTooling
} from '@riseup/tooling';
import { IOptionsReact } from './types';
import { merge } from 'merge-strategies';
import { getRoot } from '@riseup/common';

interface IDefaults<T> {
  tooling: T & DeepRequired<IOptionsTooling>;
  react: T & DeepRequired<IOptionsReact>;
}

export default function withDefaults<T extends IOptionsReact>(
  options: T
): IDefaults<T> {
  const paths = options.paths || {};
  const { tooling } = withDefaultsTooling({
    ...options,
    paths: {
      ...paths,
      build: path.join(getRoot(options), 'build')
    },
    clean: options.clean || [
      paths.docs || path.join(getRoot(options), 'docs'),
      'build',
      'deploy',
      'coverage',
      'CHANGELOG.md'
    ]
  });

  const defaults: DeepRequired<IOptionsReact> = {
    ...tooling,
    paths: {
      root: tooling.paths.root,
      docs: tooling.paths.docs
    },
    assign: {
      ...tooling.assign,
      purge: [],
      env: {
        app: {},
        process: {}
      }
    },
    server: {
      serve: { port: '8080' },
      dev: { open: false }
    }
  };

  const react = merge(defaults, options) as T & DeepRequired<IOptionsReact>;

  return { tooling, react };
}
