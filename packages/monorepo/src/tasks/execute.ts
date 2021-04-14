import { Task, exec, create, context } from 'kpo';
import { constants } from '@riseup/utils';
import { paths } from '../paths';

export function execute(): Task.Async {
  return create((ctx) => {
    const [cmd, args] = [ctx.args[0], ctx.args.slice(1)];
    if (cmd.startsWith('-')) {
      throw Error(`Execute first argument must be a command`);
    }

    return context(
      { args: [] },
      exec(constants.node, [
        paths.bin.lerna,
        'exec',
        constants.node,
        paths.bin.execute,
        cmd,
        ...['--concurrency', '1'],
        ...['--loglevel', 'silent'],
        ...args
      ])
    );
  });
}
