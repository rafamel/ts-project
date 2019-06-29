import {
  withDefaults as withCommonDefaults,
  IOptionsCommon
} from '@riseup/common';
import { IOptionsMonorepo } from './types';
import { DeepRequired } from 'utility-types';
import { merge } from 'merge-strategies';

interface IDefaults<T> {
  common: T & DeepRequired<IOptionsCommon>;
  monorepo: T & DeepRequired<IOptionsMonorepo>;
}

export default function withDefaults<T extends IOptionsMonorepo>(
  options: T
): IDefaults<T> {
  const { common } = withCommonDefaults({
    ...options,
    monorepo: false
  });

  const defaults: DeepRequired<IOptionsMonorepo> = {
    paths: common.paths,
    clean: common.clean,
    packages: { content: 'pkg' }
  };

  const monorepo = merge(defaults, common) as T &
    DeepRequired<IOptionsMonorepo>;

  return { common, monorepo };
}
