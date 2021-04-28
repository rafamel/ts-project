import { Deep, Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { tmpFile } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ConfigureNycParams {
  all?: boolean;
  threshold?: number | null;
  overrides?: Serial.Object;
}

export interface ConfigureNycOptions extends ConfigureNycParams {
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface ConfigureNycConfig {
  babel: Serial.Object;
}

export function hydrateConfigureNyc(
  options: ConfigureNycOptions | Empty
): Deep.Required<ConfigureNycOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      all: defaults.coverage.all,
      threshold: defaults.coverage.threshold,
      overrides: defaults.coverage.overrides
    },
    options || undefined
  );
}

export function configureNyc(
  options: ConfigureNycOptions | Empty,
  config: ConfigureNycConfig
): Serial.Object {
  const opts = hydrateConfigureNyc(options);
  const extensions = [...opts.extensions.js, ...opts.extensions.ts];

  const babel = tmpFile('json', {
    ...config.babel,
    ignore: ['node_modules/*'],
    extensions: extensions.map((ext) => '.' + ext)
  });
  const file = tmpFile(
    'js',
    `require(${JSON.stringify(paths.babel.register)})` +
      `(require(${JSON.stringify(babel)}));`
  );

  return merge(
    {
      all: opts.all,
      extension: extensions.map((ext) => '.' + ext),
      include: ['src/**/*'],
      require: [file],
      'check-coverage': Boolean(opts.threshold),
      ...(opts.threshold
        ? {
            branches: opts.threshold,
            lines: opts.threshold,
            functions: opts.threshold,
            statements: opts.threshold
          }
        : {})
    },
    opts.overrides || undefined
  );
}
