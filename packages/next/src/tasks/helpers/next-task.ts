import { Serial } from 'type-core';
import { create, log, series, context, exec, Task } from 'kpo';
import path from 'path';
import { tmpTask, intercept } from '@riseup/utils';
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
  return create((ctx) => {
    return series(
      log('debug', `telemetry: ${options.telemetry}`),
      context(
        (ctx) => ({ ...ctx, stdio: [null, null, ctx.stdio[2]] }),
        exec('next', ['telemetry', options.telemetry ? 'enable' : 'disable'])
      ),
      log('debug', `process intercept: ${Boolean(config.babel)}`),
      config.babel
        ? tmpTask('json', config.babel, (file) => {
            return intercept(
              {
                original: path.resolve(ctx.cwd, '.babelrc.json'),
                replacement: file
              },
              paths.bin.next,
              [cmd]
            );
          })
        : exec(paths.bin.next, [cmd])
    );
  });
}
