import { Deep, Empty, Serial } from 'type-core';
import { context, copy, exec, mkdir, series, remove, create, Task } from 'kpo';
import { merge } from 'merge-strategies';
import path from 'path';
import { getTypeScript, intercept, tmpTask, constants } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface TranspileParams {
  types?: boolean;
  output?: string;
}

export interface TranspileOptions extends TranspileParams {
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface TranspileConfig {
  babel: Serial.Object;
  typescript: Serial.Object;
}

export function hydrateTranspile(
  options: TranspileOptions | Empty
): Deep.Required<TranspileOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      types: defaults.transpile.types,
      output: defaults.transpile.output
    },
    options || undefined
  );
}

export function transpile(
  options: TranspileOptions | Empty,
  config: TranspileConfig
): Task.Async {
  const opts = hydrateTranspile(options);

  return context(
    { args: [] },
    series(
      async () => {
        // for cross-compatibility w/ build task @ library
        if (!path.isAbsolute(opts.output)) return;
        throw Error(`Transpile output must be a relative path`);
      },
      mkdir(opts.output, { ensure: true }),
      remove(path.join(opts.output, '*'), {
        glob: true,
        strict: false,
        recursive: true
      }),
      tmpTask(config.babel, (file) => {
        return exec(constants.node, [
          paths.bin.babelCli,
          'src',
          ...['--source-maps', 'inline'],
          ...['--config-file', file],
          ...['--out-dir', opts.output],
          ...[
            '--extensions',
            [...opts.extensions.js, ...opts.extensions.ts]
              .map((x) => '.' + x)
              .join(',')
          ]
        ]);
      }),
      create((ctx) => {
        return opts.types && getTypeScript(ctx.cwd)
          ? tmpTask(config.typescript, (file) => {
              return intercept(
                {
                  original: path.resolve(ctx.cwd, path.basename(file)),
                  replacement: file
                },
                paths.bin.typescript,
                [
                  ...['--project', path.resolve(ctx.cwd, path.basename(file))],
                  ...['--outDir', opts.output]
                ]
              );
            })
          : undefined;
      }),
      opts.types
        ? copy('src/**/*.d.ts', opts.output, {
            glob: true,
            single: false,
            strict: false,
            exists: 'error'
          })
        : null
    )
  );
}
