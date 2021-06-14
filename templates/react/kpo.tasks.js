const {
  recreate,
  create,
  series,
  lift,
  exec,
  catches,
  context
} = require('kpo');
const riseup = require('./riseup.config');

const tasks = {
  node: riseup.node,
  start: riseup.start,
  build: series(riseup.build, riseup.size),
  analyze: riseup.analyze,
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
  prepare: catches(null, exec('simple-git-hooks')),
  version: create(() => tasks.validate)
};

module.exports = recreate({ announce: true }, tasks);
