import { Serial } from 'type-core';
import { create, exec, Task } from 'kpo';
import path from 'path';
import { constants, tmpTask } from '@riseup/utils';
import { CracoConfigFiles, CracoConfigOptions } from './craco-config';
import { paths } from '../../paths';

export type CracoTaskOptions = CracoConfigOptions;

export interface CracoTaskConfig {
  babel: Serial.Object;
  eslint: Serial.Object;
}

export function cracoTask(
  cmd: 'start' | 'build',
  options: CracoTaskOptions,
  config: CracoTaskConfig
): Task.Async {
  return tmpTask('json', config.babel, (babel) => {
    return tmpTask('json', config.eslint, (eslint) => {
      return create((ctx) => {
        const opts: CracoConfigOptions = {
          ...options,
          webpack: options.webpack
            ? path.resolve(ctx.cwd, options.webpack)
            : null
        };

        const files: CracoConfigFiles = {
          babel,
          eslint
        };

        const content =
          `module.exports = require(${JSON.stringify(paths.craco.config)})` +
          `.default(JSON.parse('${JSON.stringify(opts)}'),` +
          `JSON.parse('${JSON.stringify(files)}'));`;

        return tmpTask('js', content, (file) => {
          return exec(constants.node, [
            ...[paths.bin.craco, cmd],
            ...['--config', file]
          ]);
        });
      });
    });
  });
}
