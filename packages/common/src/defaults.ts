import path from 'path';
import { merge } from 'merge-strategies';
import { IOptionsCommon } from '~/types';
import { DeepRequired } from 'utility-types';
import { getRoot } from './utils';

interface IDefaults<T> {
  common: T & DeepRequired<IOptionsCommon>;
}

export default function withDefaults<T extends IOptionsCommon>(
  options: T
): IDefaults<T> {
  const paths = options.paths || {};
  const defaults: DeepRequired<IOptionsCommon> = {
    monorepo: false,
    clean: [
      `coverage`,
      `CHANGELOG.md`,
      paths.docs || path.join(getRoot(options), 'docs')
    ],
    paths: {
      root: getRoot(options),
      docs: path.join(getRoot(options), 'docs')
    }
  };

  const common = merge(defaults, options) as T & DeepRequired<IOptionsCommon>;

  return { common };
}
