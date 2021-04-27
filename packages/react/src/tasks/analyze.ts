import { exec, Task } from 'kpo';
import { constants } from '@riseup/utils';
import { paths } from '../paths';

export function analyze(): Task.Async {
  return exec(constants.node, [
    paths.bin.sourceMapExplorer,
    'build/static/js/main.*.js',
    '--only-mapped'
  ]);
}
