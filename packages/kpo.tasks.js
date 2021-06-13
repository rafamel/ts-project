const {
  recreate,
  lift,
  exec,
  catches,
  series,
  context,
  create
} = require('kpo');
const riseup = require('./riseup.config');

const tasks = {
  run: riseup.run,
  execute: riseup.execute,
  build: series(
    exec('kpo', ['build'], { cwd: './utils' }),
    exec('kpo', ['build'], { cwd: './universal' }),
    exec('kpo', ['build'], { cwd: './tooling' }),
    exec('kpo', ['build'], { cwd: './react' }),
    exec('kpo', ['build'], { cwd: './monorepo' }),
    exec('kpo', ['build'], { cwd: './library' }),
    exec('kpo', ['build'], { cwd: './cli' })
  ),
  coverage: riseup.coverage,
  commit: riseup.commit,
  release: riseup.release,
  distribute: riseup.distribute,
  validate: series(
    context({ args: ['validate'] }, riseup.run),
    create(() => riseup.coverage),
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  ),
  /* Hooks */
  prepare: series(
    catches(null, exec('simple-git-hooks')),
    exec('lerna', ['bootstrap', '--ci']),
    create(() => tasks.build)
  )
};

module.exports = recreate({ announce: true }, tasks);
