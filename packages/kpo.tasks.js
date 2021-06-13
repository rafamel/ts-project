const {
  recreate,
  context,
  create,
  series,
  lift,
  exec,
  catches
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
  release: context({ args: ['--no-verify'] }, riseup.release),
  distribute: riseup.distribute,
  validate: series(
    context({ args: ['validate'] }, riseup.run),
    create(() => tasks.version)
  ),
  /* Hooks */
  postinstall: series(
    catches(null, exec('simple-git-hooks')),
    exec('lerna', ['bootstrap', '--ci']),
    create(() => tasks.build)
  ),
  version: series(
    create(() => tasks.coverage),
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  )
};

module.exports = recreate({ announce: true }, tasks);
