import { exec, Task } from 'kpo';
import { Deep, Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { constants } from '@riseup/utils';
import { defaults } from '../../defaults';
import { paths } from '../../paths';

export interface CommitParams {
  /** See: https://github.com/commitizen/cz-cli */
  path?: string;
}

export type CommitOptions = CommitParams;

export function hydrateCommit(
  options: CommitOptions | Empty
): Deep.Required<CommitOptions> {
  return shallow({ path: defaults.commit.path }, options || undefined);
}

export function commit(options: CommitOptions | Empty): Task {
  const opts = hydrateCommit(options);

  return exec(constants.node, [paths.bin.commitizen], {
    env: { COMMITIZEN_CONFIG: JSON.stringify(opts) }
  });
}
