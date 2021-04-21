import { Deep, Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { context, exec, Task, silence, finalize } from 'kpo';
import { tmpTask, constants } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface FixParams {
  dir?: string | string[];
}

export interface FixOptions extends FixParams {
  prettier?: boolean;
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface FixConfig {
  eslint: Serial.Object;
}

export function hydrateFix(
  options: FixOptions | Empty
): Deep.Required<FixOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      dir: defaults.fix.dir
    },
    options || undefined
  );
}

export function fix(
  options: FixOptions | Empty,
  config: FixConfig
): Task.Async {
  const opts = hydrateFix(options);

  return context(
    { args: [] },
    finalize(
      tmpTask(config.eslint, async (file) => {
        return exec(constants.node, [
          ...[paths.bin.eslint, '--fix'],
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
      }),
      opts.prettier
        ? silence(
            exec(constants.node, [
              paths.bin.prettier,
              ...['--write', '--ignore-unknown'],
              ...(Array.isArray(opts.dir) ? opts.dir : [opts.dir])
            ])
          )
        : null
    )
  );
}
