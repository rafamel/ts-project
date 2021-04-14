import { Empty, Deep } from 'type-core';
import { shallow } from 'merge-strategies';
import { Task, exec, series, context } from 'kpo';
import { constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface DistributeParams {
  /** Whether to push repository after publish */
  push?: boolean;
  /** Subdirectory to publish for all packages */
  contents?: string | null;
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

  return series(
    exec(constants.node, [
      paths.bin.lerna,
      ...['publish', 'from-package'],
      ...(opts.contents ? ['--contents', opts.contents] : [])
    ]),
    opts.push
      ? context({ args: [] }, exec('git', ['push', '--follow-tags']))
      : null
  );
}
