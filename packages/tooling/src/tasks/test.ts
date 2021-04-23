import { Serial } from 'type-core';
import { exec, Task } from 'kpo';
import { tmpTask, constants } from '@riseup/utils';
import { paths } from '../paths';

export interface TestConfig {
  jest: Serial.Object;
}

export function test(config: TestConfig): Task.Async {
  return tmpTask('json', config.jest, async (file) => {
    return exec(constants.node, [
      paths.bin.jest,
      '--config',
      file,
      '--rootDir',
      './'
    ]);
  });
}
