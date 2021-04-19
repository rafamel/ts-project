import { Deep, Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { context, exec, finalize, create, print, series, Task } from 'kpo';
import { getTypeScriptPath, tmpTask, constants } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface LintParams {
  dir?: string | string[];
  types?: boolean;
}

export interface LintOptions extends LintParams {
  prettier?: boolean;
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface LintConfig {
  eslint: Serial.Object;
}

export function hydrateLint(
  options: LintOptions | Empty
): Deep.Required<LintOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      dir: defaults.lint.dir,
      types: defaults.lint.types
    },
    options || undefined
  );
}

export function lint(
  options: LintOptions | Empty,
  config: LintConfig
): Task.Async {
  const opts = hydrateLint(options);

  return context(
    { args: [] },
    finalize(
      series(
        print('Checking rules...'),
        tmpTask(config.eslint, async (file) => {
          return exec(constants.node, [
            paths.bin.eslint,
            ...(Array.isArray(opts.dir) ? opts.dir : [opts.dir]),
            ...['--config', file],
            ...[
              '--ext',
              [...opts.extensions.js, ...opts.extensions.ts]
                .map((x) => '.' + x)
                .join(',')
            ],
            ...['--resolve-plugins-relative-to', paths.riseup.tooling]
          ]);
        })
      ),
      finalize(
        create((ctx) => {
          return opts.types && getTypeScriptPath(ctx.cwd)
            ? series(
                print('Checking types...'),
                exec(constants.node, [paths.bin.typescript, '--noEmit'])
              )
            : null;
        }),
        opts.prettier
          ? exec(constants.node, [
              paths.bin.prettier,
              '--check',
              ...(Array.isArray(opts.dir) ? opts.dir : [opts.dir])
            ])
          : null
      )
    )
  );
}
