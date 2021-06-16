import { Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { parallel, watch as kpoWatch, catches, series, log, Task } from 'kpo';
import { LintOptions, LintConfig, hydrateLint, lint } from '@riseup/tooling';
import { hydrateNextGlobal } from '../global';
import { defaults } from '../defaults';
import { dev } from './dev';

export interface WatchParams {
  clear?: boolean;
  include?: string[];
  exclude?: string[];
}

export interface WatchOptions extends WatchParams, LintOptions {
  telemetry?: boolean;
}

export interface WatchConfig extends LintConfig {
  babel: Serial.Object;
}

export function hydrateWatch(
  options: WatchOptions | Empty
): Required<WatchOptions> {
  const { telemetry } = hydrateNextGlobal(options);
  return {
    telemetry,
    ...hydrateLint(options),
    ...merge(
      {
        clear: defaults.watch.clear,
        include: defaults.watch.include,
        exclude: defaults.watch.exclude
      },
      options || undefined
    )
  };
}

export function watch(
  options: WatchOptions | Empty,
  config: WatchConfig
): Task.Async {
  const opts = hydrateWatch(options);

  return parallel(
    dev(opts, config),
    kpoWatch(
      {
        prime: true,
        clear: true,
        include: ['./src'],
        exclude: []
      },
      catches(
        { level: 'silent' },
        series(
          lint(options, config),
          log('success', 'No linting errors found')
        ),
        log('warn', 'Linting errors found')
      )
    )
  );
}
