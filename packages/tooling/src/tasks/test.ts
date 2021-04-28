import { Serial } from 'type-core';
import { create, Task } from 'kpo';
import path from 'path';
import { tmpTask, intercept } from '@riseup/utils';
import { paths } from '../paths';

export interface TestConfig {
  ava: Serial.Object;
}

export function test(config: TestConfig): Task.Async {
  return create((ctx) => {
    return tmpTask(
      'cjs',
      `module.exports = ${JSON.stringify(config.ava)};`,
      (file) => {
        return intercept(
          {
            original: path.resolve(ctx.cwd, path.basename(file)),
            replacement: file
          },
          paths.bin.ava,
          ['--config', path.basename(file)],
          { env: { NODE_ENV: ctx.env.NODE_ENV || 'test' } }
        );
      }
    );
  });
}
