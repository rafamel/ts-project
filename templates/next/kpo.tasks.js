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
  node: riseup.node,
  start: riseup.start,
  dev: riseup.dev,
  watch: riseup.watch,
  build: series(riseup.build, riseup.size),
  export: riseup.export,
  public: riseup.public,
  explore: riseup.explore,
  fix: riseup.fix,
  lint: series(riseup.lintmd, riseup.lint),
  test: riseup.test,
  commit: riseup.commit,
  release: context({ args: ['--no-verify'] }, riseup.release),
  validate: series(
    create(() => tasks.lint),
    create(() => tasks.test),
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  ),
  /* Hooks */
  prepare: riseup.public,
  postinstall: catches(null, exec('simple-git-hooks')),
  version: create(() => tasks.validate)
};

module.exports = recreate({ announce: true }, tasks);
