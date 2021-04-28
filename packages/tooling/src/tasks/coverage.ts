import { Serial } from 'type-core';
import { create, exec, finalize, remove, Task } from 'kpo';
import path from 'path';
import { tmpTask, tmpPath, constants } from '@riseup/utils';
import { paths } from '../paths';

export interface CoverageConfig {
  ava: Serial.Object;
  nyc: Serial.Object;
}

export function coverage(config: CoverageConfig): Task.Async {
  return create((ctx) => {
    return tmpTask(
      'cjs',
      `module.exports = ${JSON.stringify(config.ava)};`,
      (avafile) => {
        return tmpTask('json', config.nyc, (nycfile) => {
          const tmpDir = tmpPath(null, null);
          const avadest = path.resolve(ctx.cwd, path.basename(avafile));

          return finalize(
            exec(
              constants.node,
              [
                paths.bin.nyc,
                ...['--nycrc-path', nycfile],
                ...['--temp-dir', tmpDir],
                ...[
                  constants.node,
                  ...['-r', constants.interceptor.path],
                  ...[paths.bin.ava, '--config', avadest]
                ]
              ],
              {
                env: {
                  NODE_ENV: ctx.env.NODE_ENV || 'test',
                  [constants.interceptor.env.original]: avadest,
                  [constants.interceptor.env.replacement]: avafile
                }
              }
            ),
            remove(tmpDir, { glob: false, strict: false, recursive: true })
          );
        });
      }
    );
  });
}
