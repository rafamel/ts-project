const { recreate, lift, exec, catches, series, create } = require('kpo');
const riseup = require('./riseup.config');

const tasks = {
  node: riseup.node,
  build: riseup.build,
  docs: riseup.docs,
  fix: riseup.fix,
  lint: series(riseup.lintmd, riseup.lint),
  test: riseup.test,
  commit: riseup.commit,
  release: riseup.release,
  distribute: riseup.distribute,
  validate: series(
    create(() => tasks.lint),
    create(() => tasks.test),
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  ),
  /* Hooks */
  prepare: catches(null, exec('simple-git-hooks')),
  prepublishOnly: create(() => tasks.validate),
  version: series(
    create(() => tasks.validate),
    create(() => tasks.build),
    create(() => tasks.docs)
  )
};

module.exports = recreate({ announce: true }, tasks);
