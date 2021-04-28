import { Deep, Serial } from 'type-core';
import { capture } from 'errorish';
import { context, copy, create, exec, mkdir, run, series, Task } from 'kpo';
import path from 'path';
import { BuilderOptions } from '@pika/types';
import { reconfigureBabelEnv } from '@riseup/tooling';
import {
  constants,
  getTypeScriptPath,
  intercept,
  tmpTask
} from '@riseup/utils';
import { paths } from '../../paths';
import {
  ConfigurePikaConfig,
  ConfigurePikaOptions,
  hydrateConfigurePika
} from './index';

const output = 'dist/';

export function manifest(
  manifest: Serial.Object,
  { cwd, options: { options } }: BuilderOptions
): void {
  const opts = hydrateConfigurePika(options);
  const isTypeScript = Boolean(opts.types && getTypeScriptPath(cwd));

  manifest.main = output;
  if (isTypeScript) manifest.types = output;

  manifest.files = ((manifest.files || []) as string[])
    .concat(output)
    .filter((x, i, arr) => arr.indexOf(x) === i);
}

export async function build({
  cwd,
  options: { options, config }
}: BuilderOptions): Promise<void> {
  try {
    const task = transpile(output, hydrateConfigurePika(options), config);
    await run({ cwd }, task);
  } catch (err) {
    throw capture(err);
  }
}

function transpile(
  dir: string,
  options: Deep.Required<ConfigurePikaOptions>,
  config: ConfigurePikaConfig
): Task.Async {
  const destination = path.join(options.destination, dir);
  return context(
    { args: [] },
    series(
      mkdir(destination, { ensure: true }),
      tmpTask(
        'json',
        reconfigureBabelEnv({ targets: options.targets }, config.babel),
        (file) => {
          return exec(constants.node, [
            paths.bin.babelCli,
            'src',
            ...['--source-maps', 'inline'],
            ...['--config-file', file],
            ...['--out-dir', destination],
            ...[
              '--extensions',
              [...options.extensions.js, ...options.extensions.ts]
                .map((x) => '.' + x)
                .join(',')
            ]
          ]);
        }
      ),
      create((ctx) => {
        return options.types && getTypeScriptPath(ctx.cwd)
          ? tmpTask('json', config.typescript, (file) => {
              const project = path.resolve(ctx.cwd, path.basename(file));

              return intercept(
                { original: project, replacement: file },
                paths.bin.typescript,
                [
                  '--declaration',
                  '--emitDeclarationOnly',
                  ...['--noEmit', 'false'],
                  ...['--project', project],
                  ...['--outDir', destination]
                ]
              );
            })
          : undefined;
      }),
      options.types
        ? copy('src/**/*.d.ts', destination, {
            glob: true,
            single: false,
            strict: false,
            exists: 'error'
          })
        : null
    )
  );
}
