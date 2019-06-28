import path from 'path';
import { DeepRequired } from 'utility-types';
import { IOptionsLibrary } from './types';
import {
  withDefaults as withDefaultsTooling,
  IOptionsTooling
} from '@riseup/tooling';
import { getRoot } from '@riseup/common';

interface IDefaults<T> {
  tooling: T & DeepRequired<IOptionsTooling>;
  library: T & DeepRequired<IOptionsLibrary>;
}

export default function withDefaults<T extends IOptionsLibrary>(
  options: T
): IDefaults<T> {
  const paths = options.paths || {};
  const build = path.join(getRoot(options), 'pkg');

  const { tooling } = withDefaultsTooling({
    ...options,
    paths: {
      ...paths,
      build: path.join(paths.build || build, 'dist')
    },
    clean: [
      paths.build || build,
      paths.docs || path.join(getRoot(options), 'docs'),
      'coverage',
      'CHANGELOG.md'
    ]
  });

  const library: T & DeepRequired<IOptionsLibrary> = {
    ...tooling,
    paths: {
      ...tooling.paths,
      build: paths.build || build
    }
  };

  return { tooling, library };
}
