import { exec, Task } from 'kpo';
import { Empty } from 'type-core';
import { shallow } from 'merge-strategies';
import { constants } from '@riseup/utils';
import { paths } from '../../paths';
import { defaults } from '../../defaults';

export interface CommitParams {
  /** See: https://github.com/commitizen/cz-cli */
  path?: string;
}

export interface CommitOptions extends CommitParams {}

export function commit(options: CommitOptions | Empty): Task {
  const opts = shallow({ path: defaults.commit.path }, options || undefined);

  return exec(constants.node, [paths.bin.commitizen], {
    env: { COMMITIZEN_CONFIG: JSON.stringify(opts) }
  });
}
