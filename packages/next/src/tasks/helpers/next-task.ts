import { Serial } from 'type-core';
import { log, series, context, exec, Task } from 'kpo';
import { intercept, constants } from '@riseup/utils';
import { paths } from '../../paths';

export interface NextTaskOptions {
  telemetry: boolean;
}

export interface NextTaskConfig {
  babel: Serial.Object | null;
}

export function nextTask(
  cmd: 'start' | 'dev' | 'build' | 'export',
  options: NextTaskOptions,
  config: NextTaskConfig
): Task.Async {
  return series(
    context(
      { args: [] },
      series(
        log('debug', `telemetry: ${options.telemetry}`),
        context(
          (ctx) => ({ ...ctx, stdio: [null, null, ctx.stdio[2]] }),
          exec('next', ['telemetry', options.telemetry ? 'enable' : 'disable'])
        ),
        log('debug', `process intercept: ${Boolean(config.babel)}`)
      )
    ),
    config.babel
      ? intercept(
          {
            path: '.babelrc',
            content: JSON.stringify(config.babel),
            require: 'json'
          },
          paths.bin.nextEntry,
          [cmd]
        )
      : exec(constants.node, [paths.bin.next, cmd])
  );
}
