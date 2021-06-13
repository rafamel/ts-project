import { Serial } from 'type-core';
import { create, exec, Task } from 'kpo';
import { tmpTask, constants } from '@riseup/utils';
import { paths } from '../paths';

export interface TestConfig {
  jest: Serial.Object;
}

export function test(config: TestConfig): Task.Async {
  return create((ctx) => {
    return tmpTask('json', config.jest, async (file) => {
      return exec(
        constants.node,
        [paths.bin.jest, ...['--config', file], ...['--rootDir', ctx.cwd]],
        { env: { NODE_ENV: ctx.env.NODE_ENV || 'test' } }
      );
    });
  });
}
