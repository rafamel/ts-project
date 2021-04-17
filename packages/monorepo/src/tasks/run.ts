import { Task, exec, create, context } from 'kpo';
import { constants } from '@riseup/utils';
import { paths } from '../paths';

export function run(): Task.Async {
  return create((ctx) => {
    const [cmd, args] = [ctx.args[0], ctx.args.slice(1)];

    if (cmd === '-h' || cmd === '--help') {
      return context(
        { args: [] },
        exec(constants.node, [paths.bin.lerna, 'exec', '--help'])
      );
    }

    if (cmd.startsWith('-')) {
      throw Error(`Run first argument must be a script name`);
    }

    return context(
      { args: [] },
      exec(constants.node, [
        paths.bin.lerna,
        'exec',
        constants.node,
        paths.bin.run,
        cmd,
        ...['--concurrency', '1'],
        ...['--loglevel', 'silent'],
        ...args
      ])
    );
  });
}
