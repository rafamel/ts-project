import slim from 'slimconf';
import { IProjectTooling, IOptionsTooling } from './types';
import withDefaults from './defaults';
import commonCreate from '@riseup/common';
import { getBabel, getEslint, getJest } from './presets';
import { extend } from './utils';
import getScripts from './scripts';

export default function create(options: IOptionsTooling = {}): IProjectTooling {
  const defaults = withDefaults(options);
  const common = commonCreate(defaults.common);

  return {
    package: common.package,
    options: slim(defaults.tooling),
    scripts: getScripts(common.scripts, defaults.tooling),
    babel: extend(getBabel(defaults.tooling), defaults.tooling.extend.babel),
    eslint: extend(getEslint(defaults.tooling), defaults.tooling.extend.eslint),
    jest: extend(getJest(defaults.tooling), defaults.tooling.extend.jest),
    typedoc: extend({} as any, defaults.tooling.extend.typedoc)
  };
}
