import { Serial } from 'type-core';
import { create, exec, Task } from 'kpo';
import path from 'path';
import { constants, tmpTask } from '@riseup/utils';
import { CracoConfigFiles, CracoConfigOptions } from './craco-config';
import { paths } from '../../paths';

export type CracoTaskOptions = CracoConfigOptions;

export interface CracoTaskConfig {
  babel: Serial.Object;
  typescript: Serial.Object;
  eslint: Serial.Object;
}

export function cracoTask(
  cmd: 'start' | 'build',
  options: CracoTaskOptions,
  config: CracoTaskConfig
): Task.Async {
  return create((ctx) => {
    const opts: CracoConfigOptions & Serial.Object = {
      ...options,
      webpack: options.webpack ? path.resolve(ctx.cwd, options.webpack) : null
    };

    const tsconfig = {
      ...config.typescript,
      include: [path.resolve(ctx.cwd, 'src')],
      compilerOptions: {
        ...((config.typescript.compilerOptions as Serial.Object) || {}),
        noEmit: true
      }
    };

    return tmpTask('json', opts, (optsfile) => {
      return tmpTask('json', config.babel, (babel) => {
        return tmpTask('json', tsconfig, (typescript) => {
          return tmpTask('json', config.eslint, (eslint) => {
            const files: CracoConfigFiles = {
              babel,
              typescript,
              eslint
            };

            const content =
              `module.exports = require(${JSON.stringify(
                paths.craco.config
              )})` +
              '.default(' +
              `require(${JSON.stringify(optsfile)}),` +
              `JSON.parse('${JSON.stringify(files)}')` +
              ');';

            return tmpTask('js', content, (file) => {
              return exec(constants.node, [
                ...[paths.bin.craco, cmd],
                ...['--config', file]
              ]);
            });
          });
        });
      });
    });
  });
}
