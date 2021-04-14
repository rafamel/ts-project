import { create, run, series, log, style, exec, context } from 'kpo';
import { getScopeName } from '../../helpers/get-scope-name';

run(
  create((ctx) => {
    const scope = getScopeName(ctx.cwd);
    return context(
      { args: [] },
      series(
        log('info', 'Scope:', style(scope, { bold: true })),
        exec(ctx.args[0], ctx.args.slice(1))
      )
    );
  }),
  {
    cwd: process.cwd(),
    args: process.argv.slice(2)
  }
).catch((err) => {
  return Promise.resolve()
    .then(() => run(log('error', err.message)))
    .finally(() => process.exit(1));
});
