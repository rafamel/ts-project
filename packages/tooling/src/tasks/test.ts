import { Serial } from 'type-core';
import { create, exec, Task } from 'kpo';
import { temporal, constants } from '@riseup/utils';
import { paths } from '../paths';

export interface TestConfig {
  jest: Serial.Object;
}

export function test(config: TestConfig): Task.Async {
  return create((ctx) => {
    return temporal(
      {
        ext: 'json',
        content: JSON.stringify(config.jest),
        overrides: [
          'jest.config.js',
          'jest.config.ts',
          'jest.config.cjs',
          'jest.config.mjs',
          'jest.config.json'
        ]
      },
      async ([file]) => {
        return exec(
          constants.node,
          [paths.bin.jest, ...['--config', file], ...['--rootDir', ctx.cwd]],
          { env: { NODE_ENV: ctx.env.NODE_ENV || 'test' } }
        );
      }
    );
  });
}
