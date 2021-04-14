import { create, run, series, print, log, style, exec, context } from 'kpo';
import { getScopeName } from '../../helpers/get-scope-name';

run(
  create((ctx) => {
    return context(
      { args: [] },
      series(
        log(
          'info',
          'Scope:',
          style(getScopeName(ctx.cwd), { bold: true, color: 'yellow' })
        ),
        exec(ctx.args[0], ctx.args.slice(1))
      )
    );
  }),
  {
    cwd: process.cwd(),
    args: process.argv.slice(2)
  }
).catch((err) => {
  return run(print('Error:', err.message)).finally(() => process.exit(1));
});
