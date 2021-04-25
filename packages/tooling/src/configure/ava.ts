import { Deep, Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { tmpFile } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ConfigureAvaParams {
  verbose?: boolean;
  require?: string[];
  overrides?: Serial.Object;
}

export interface ConfigureAvaOptions extends ConfigureAvaParams {
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface ConfigureAvaConfig {
  babel: Serial.Object;
}

export function hydrateConfigureAva(
  options: ConfigureAvaOptions | Empty
): Deep.Required<ConfigureAvaOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      verbose: defaults.test.verbose,
      require: defaults.test.require,
      overrides: defaults.test.overrides
    },
    options || undefined
  );
}

export function configureAva(
  options: ConfigureAvaOptions | Empty,
  config: ConfigureAvaConfig
): Serial.Object {
  const opts = hydrateConfigureAva(options);
  const extensions = [...opts.extensions.js, ...opts.extensions.ts];

  const babel = {
    ...config.babel,
    ignore: ['node_modules/*'],
    extensions: extensions.map((ext) => '.' + ext)
  };

  const file = tmpFile(
    'js',
    `require(${JSON.stringify(paths.babel.register)})` +
      `(JSON.parse('${JSON.stringify(babel)}'));`
  );

  return merge(
    {
      verbose: opts.verbose,
      require: [file, ...opts.require],
      extensions
    },
    opts.overrides || undefined
  );
}
