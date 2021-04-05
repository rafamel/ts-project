import { TypeGuard, Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { Task, exec } from 'kpo';
import { constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ChangelogParams {
  preset?: string;
  infile?: string;
  outfile?: string;
  append?: boolean;
  releaseCount?: number;
  skipUnstable?: boolean;
}

export interface ChangelogOptions extends ChangelogParams {}

export function changelog(options: ChangelogOptions | Empty): Task.Async {
  const opts = shallow(
    {
      preset: defaults.changelog.preset,
      infile: defaults.changelog.infile,
      outfile: defaults.changelog.outfile,
      append: defaults.changelog.append,
      releaseCount: defaults.changelog.releaseCount,
      skipUnstable: defaults.changelog.skipUnstable
    },
    options || undefined
  );

  return exec(
    constants.bin.node,
    [
      paths.bin.changelog,
      ...(opts.preset ? ['--preset', opts.preset] : []),
      ...(opts.infile ? ['--infile', opts.infile] : []),
      ...(opts.outfile ? ['--outfile', opts.outfile] : []),
      ...(opts.append ? ['--append'] : []),
      ...(TypeGuard.isEmpty(opts.releaseCount)
        ? []
        : ['--release-count', String(opts.releaseCount)]),
      ...(opts.skipUnstable ? ['--skip-unstable'] : [])
    ],
    { briefError: true }
  );
}
