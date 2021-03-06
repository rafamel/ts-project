import { Empty, Deep } from 'type-core';
import { series, Task, exec, confirm, context, progress } from 'kpo';
import { shallow } from 'merge-strategies';
import path from 'path';
import { defaults } from '../defaults';

export interface DistributeParams {
  push?: boolean;
  contents?: string;
}

export type DistributeOptions = DistributeParams;

export function hydrateDistribute(
  options: DistributeOptions | Empty
): Deep.Required<DistributeOptions> {
  return shallow(
    {
      push: defaults.distribute.push,
      contents: defaults.distribute.contents
    },
    options || undefined
  );
}

export function distribute(options: DistributeOptions | Empty): Task.Async {
  const opts = hydrateDistribute(options);

  return context(
    (ctx) => ({ ...ctx, cwd: path.resolve(ctx.cwd, opts.contents) }),
    series(
      exec('npm', ['publish', '--dry-run']),
      confirm(
        { message: 'Continue?', default: true },
        series(
          progress({ message: 'Publish package' }, exec('npm', ['publish'])),
          opts.push
            ? progress(
                { message: 'Push to remote' },
                context({ args: [] }, exec('git', ['push', '--follow-tags']))
              )
            : null
        )
      )
    )
  );
}
