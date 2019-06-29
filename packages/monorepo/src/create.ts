import { IOptionsMonorepo, IProjectMonorepo } from './types';
import commonCreate from '@riseup/common';
import getScripts from './scripts';
import slim from 'slimconf';
import withDefaults from './defaults';

export default function create(
  options: IOptionsMonorepo = {}
): IProjectMonorepo {
  const defaults = withDefaults(options);
  const common = commonCreate(defaults.common);

  return {
    ...common,
    options: slim(defaults.monorepo),
    scripts: getScripts(common.scripts, defaults.monorepo)
  };
}
