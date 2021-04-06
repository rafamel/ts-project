import { Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { context, exec, finalize, create, Task } from 'kpo';
import { getTypeScript, tmpTask, constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface LintParams {
  dir?: string | string[];
  types?: boolean;
}

export interface LintOptions extends LintParams {
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface LintConfig {
  eslint: Serial.Object;
}

export function lint(
  options: LintOptions | Empty,
  config: LintConfig
): Task.Async {
  const opts = merge(
    {
      dir: defaults.lint.dir,
      types: defaults.lint.types,
      extensions: defaults.global.extensions
    },
    options || undefined
  );

  return context(
    { args: [] },
    finalize(
      tmpTask(config.eslint, async (file) => {
        return exec(
          constants.bin.node,
          [
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
          ],
          { briefError: true }
        );
      }),
      create((ctx) => {
        return opts.types && getTypeScript(ctx.cwd)
          ? exec(constants.bin.node, [paths.bin.typescript, '--noEmit'], {
              briefError: true
            })
          : undefined;
      })
    )
  );
}
