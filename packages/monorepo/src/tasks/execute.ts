import { Task, exec, create, context, series, log } from 'kpo';
import { constants } from '@riseup/utils';
import { paths } from '../paths';

export function execute(): Task.Async {
  return create((ctx) => {
    const [cmd, args] = [ctx.args[0], ctx.args.slice(1)];

    if (cmd === '-h' || cmd === '--help') {
      return context(
        { args: [] },
        exec(constants.node, [paths.bin.lerna, 'exec', '--help'])
      );
    }

    if (cmd.startsWith('-')) {
      throw Error(`Execute first argument must be a command`);
    }

    return context(
      { args: [] },
      series(
        exec(constants.node, [
          paths.bin.lerna,
          'exec',
          process.platform === 'win32' ? 'node' : constants.node,
          paths.bin.execute,
          cmd,
          ...['--concurrency', '1'],
          ...['--loglevel', 'silent'],
          '--',
          ...args
        ]),
        log('success', 'Serial execute: ' + cmd)
      )
    );
  });
}
