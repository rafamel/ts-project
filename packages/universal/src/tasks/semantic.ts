import { Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { create, series, log, exec, context, Task, confirm } from 'kpo';
import chalk from 'chalk';
import bump, { Recommendation, Options } from 'conventional-recommended-bump';
import { defaults } from '../defaults';

export interface SemanticParams extends Options {
  preset?: string;
}

export interface SemanticOptions extends SemanticParams {}

export function semantic(options: SemanticOptions | Empty): Task.Async {
  const opts = shallow(
    { preset: defaults.semantic.preset },
    options || undefined
  );

  return create(async (ctx) => {
    const { reason, releaseType } = await new Promise<Recommendation>(
      (resolve, reject) => {
        return bump(opts, (err, value) => {
          return err ? reject(err) : resolve(value);
        });
      }
    );

    const arg = (ctx.args[0] || '').trim();
    return series(
      arg
        ? log('info', `Version bump: ${chalk.bold.green(ctx.args[0])}`)
        : null,
      log(
        'info',
        'Recommended version bump:',
        arg ? chalk.bold.red(releaseType) : chalk.bold.green(releaseType)
      ),
      log('info', reason),
      arg && releaseType !== arg
        ? log('warn', 'Explicit version bump differs from recommended bump')
        : null,
      confirm(
        { message: 'Continue?', default: true },
        context({ args: [] }, exec('npm', ['version', arg || releaseType]))
      )
    );
  });
}
