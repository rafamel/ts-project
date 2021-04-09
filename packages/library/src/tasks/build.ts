import { Serial, Empty, TypeGuard } from 'type-core';
import { shallow } from 'merge-strategies';
import { v4 as uuid } from 'uuid';
import path from 'path';
import {
  create,
  context,
  exec,
  finalize,
  mkdir,
  move,
  remove,
  series,
  Task
} from 'kpo';
import { tmpTask, constants, intercept } from '@riseup/utils';
import { reconfigureBabel } from '@riseup/tooling';
import { paths } from '../paths';
import { defaults } from '../defaults';

export interface BuildParams {
  pack?: boolean | string;
  destination?: string;
}

export interface BuildOptions extends BuildParams {}

export interface BuildConfig {
  pika: Serial.Array;
  babel: Serial.Object;
}

export function build(
  options: BuildOptions | Empty,
  config: BuildConfig
): Task.Async {
  const opts = shallow(
    {
      pack: defaults.build.pack,
      destination: defaults.build.destination
    },
    options || undefined
  );

  return create((ctx) => {
    return series(
      tmpTask(
        reconfigureBabel({ targets: { esmodules: true } }, config.babel),
        (file) => {
          return intercept(
            {
              original: path.resolve(ctx.cwd, '.babelrc.json'),
              replacement: file
            },
            paths.bin.pika,
            [
              ...['--out', opts.destination],
              ...['--pipeline', JSON.stringify(config.pika)]
            ]
          );
        }
      ),
      create((ctx) => {
        if (!opts.pack) return;

        const custom = TypeGuard.isString(opts.pack);
        const dir = custom
          ? path.resolve(constants.tmp, uuid())
          : opts.destination;
        return context(
          { args: [] },
          finalize(
            series(
              custom ? mkdir(dir, { ensure: false }) : null,
              exec('npm', ['pack', path.resolve(ctx.cwd, opts.destination)], {
                cwd: dir
              }),
              custom
                ? move(
                    path.resolve(dir, '*.tgz'),
                    path.resolve(opts.destination, String(opts.pack) + '.tgz'),
                    {
                      glob: true,
                      single: true,
                      strict: true,
                      exists: 'error'
                    }
                  )
                : null
            ),
            custom ? remove(dir, { strict: true, recursive: true }) : null
          )
        );
      })
    );
  });
}
