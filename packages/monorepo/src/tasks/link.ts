import { Task, exec, progress } from 'kpo';
import { constants } from '@riseup/utils';
import { paths } from '../paths';

export function link(): Task.Async {
  return progress(
    { message: 'Symlinking packages and binaries' },
    exec(constants.node, [paths.bin.lerna, 'link'])
  );
}
