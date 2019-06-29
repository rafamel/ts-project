import fs from 'fs-extra';
import path from 'path';
import { IProjectReact, IOptionsReact } from './types';
import toolingCreate, { extend } from '@riseup/tooling';
import getScripts from './scripts';
import slim from 'slimconf';
import { getBabel, getEslint } from './presets';
import withDefaults from './defaults';

export default function create(options: IOptionsReact = {}): IProjectReact {
  const pre = withDefaults(options);
  const babel = getBabel(pre.react);
  const eslint = getEslint(pre.react);
  const jest = {};

  const defaults = withDefaults({
    ...pre.react,
    extend: {
      babel: {
        strategy: 'replace',
        configure: extend(babel, pre.react.extend.babel)
      },
      eslint: {
        strategy: 'replace',
        configure: extend(eslint, pre.react.extend.eslint)
      },
      jest: {
        strategy: 'replace',
        configure: extend(jest, pre.react.extend.jest)
      }
    }
  });
  const tooling = toolingCreate(defaults.tooling);

  if (
    !fs.pathExistsSync(path.join(defaults.react.paths.root, 'craco.config.js'))
  ) {
    throw Error(`File craco.config.js is required to exist at project root`);
  }

  return {
    ...tooling,
    options: slim(defaults.react),
    scripts: getScripts(tooling, defaults.react),
    craco: {}
  };
}
