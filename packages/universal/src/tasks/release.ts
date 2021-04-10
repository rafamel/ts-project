import bump, { Recommendation } from 'conventional-recommended-bump';
import { create, series, log, confirm, exec, Task } from 'kpo';
import { Deep, Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import chalk from 'chalk';
import arg from 'arg';
import { constants, tmpTask } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ReleaseParams {
  conventional?: {
    active?: boolean;
    preset?: string;
  };
}

export type ReleaseOptions = ReleaseParams;

export interface ReleaseConfig {
  releaseit: Serial.Object;
}

export function hydrateRelease(
  options: ReleaseOptions | Empty
): Deep.Required<ReleaseOptions> {
  return merge(
    {
      conventional: {
        active: defaults.release.conventional.active,
        preset: defaults.release.conventional.preset
      }
    },
    options || undefined
  );
}

export function release(
  options: ReleaseOptions | Empty,
  config: ReleaseConfig
): Task.Async {
  const opts = hydrateRelease(options);

  const releaseit = tmpTask(config.releaseit, async (file) => {
    return exec(constants.node, [paths.bin.releaseit, ...['--config', file]]);
  });

  if (!opts.conventional.active) return releaseit;

  return create(async (ctx) => {
    const cmd = arg(
      {
        '--ci': Boolean,
        '-i': '--increment',
        '--increment': String,
        '-h': '--help',
        '--help': Boolean,
        '-v': '--version',
        '--version': Boolean
      },
      { argv: ctx.args, permissive: true }
    );

    if (cmd['--help'] || cmd['--version']) return releaseit;

    const { reason, releaseType } = await new Promise<Recommendation>(
      (resolve, reject) => {
        return bump({ preset: opts.conventional.preset }, (err, value) => {
          return err ? reject(err) : resolve(value);
        });
      }
    );

    return series(
      cmd['--increment']
        ? log('info', `Version bump: ${chalk.bold.green(cmd['--increment'])}`)
        : null,
      log(
        'info',
        'Recommended version bump:',
        cmd['--increment']
          ? chalk.bold.red(releaseType)
          : chalk.bold.green(releaseType)
      ),
      log('info', reason),
      cmd['--increment'] && releaseType !== cmd['--increment']
        ? log('warn', 'Explicit version bump differs from recommended bump')
        : null,
      cmd['--ci']
        ? releaseit
        : confirm({ message: 'Continue?', default: true }, releaseit)
    );
  });
}
