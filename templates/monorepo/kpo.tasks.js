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
  build: context({ args: ['build'] }, riseup.run),
  lint: riseup.lintmd,
  coverage: riseup.coverage,
  commit: riseup.commit,
  release: riseup.release,
  distribute: riseup.distribute,
  validate: series(
    context({ args: ['validate'] }, riseup.run),
    create(() => tasks.lint),
    create(() => tasks.coverage),
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
