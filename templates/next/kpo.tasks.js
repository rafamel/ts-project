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
  favicons: riseup.favicons,
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
  postinstall: series(catches(null, exec('simple-git-hooks')), riseup.favicons),
  version: create(() => tasks.validate)
};

module.exports = recreate({ announce: true }, tasks);
