import { IProjectLibrary, IOptionsLibrary } from './types';
import createTooling from '@riseup/tooling';
import getScripts from './scripts';
import slim from 'slimconf';
import withDefaults from './defaults';

export default function create(options: IOptionsLibrary = {}): IProjectLibrary {
  const defaults = withDefaults(options);
  const tooling = createTooling(defaults.tooling);

  return {
    ...tooling,
    options: slim(defaults.library),
    scripts: getScripts(tooling.scripts, defaults.library)
  };
}
