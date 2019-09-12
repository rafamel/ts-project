import { DeepRequired } from 'utility-types';
import { IScriptsReact, IOptionsReact } from '~/types';
import { IProjectTooling } from '@riseup/tooling';
import cra from './cra';
import { bin } from '@riseup/common';

export default function getScripts(
  tooling: IProjectTooling,
  options: DeepRequired<IOptionsReact>
): IScriptsReact {
  const toolingScripts = tooling.scripts;
  const toolingOptions = tooling.options.pure();

  delete toolingScripts['build:transpile'];
  delete toolingScripts['build:types'];
  const scripts: IScriptsReact = {
    ...toolingScripts,
    start: () => cra(['start'], toolingOptions, options),
    build: () => cra(['build'], toolingOptions, options),
    serve: () => (args = []) => [
      bin('serve', 'serve', {
        args: ['./build', ...['-l', options.server.serve.port], ...args]
      })
    ],
    analyze: () => (args = []) => [
      bin('source-map-explorer', 'source-map-explorer', {
        args: ['build/static/js/main.*.js', '--only-mapped', ...args]
      })
    ],
    test: () => cra(['test', '--watchAll=false'], toolingOptions, options),
    'test:watch': () => cra(['test'], toolingOptions, options),
    prepublishOnly: () => Error(`This package can't be published`)
  };

  return scripts;
}
