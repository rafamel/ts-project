import slim from 'slimconf';
import { IProjectTooling, IOptionsTooling } from './types';
import withDefaults from './defaults';
import commonCreate from '@riseup/common';
import { extend } from './utils';

export default function create(options: IOptionsTooling = {}): IProjectTooling {
  const defaults = withDefaults(options);
  const common = commonCreate(defaults.common);

  return {
    package: common.package,
    options: slim(defaults.tooling),
    scripts: {} as any,
    babel: extend({} as any, defaults.tooling.extend.babel),
    eslint: extend({} as any, defaults.tooling.extend.eslint),
    jest: extend({} as any, defaults.tooling.extend.jest),
    typedoc: extend({} as any, defaults.tooling.extend.typedoc)
  };
}
