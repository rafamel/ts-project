const { recreate, lift, exec, catches, series, create } = require('kpo');
const riseup = require('./riseup.packages');

const tasks = {
  node: riseup.node,
  build: riseup.build,
  docs: riseup.docs,
  fix: riseup.fix,
  lint: series(riseup.lint, riseup.lintmd),
  test: riseup.test,
  coverage: riseup.coverage,
  commit: riseup.commit,
  release: riseup.release,
  distribute: riseup.distribute,
  validate: series(
    riseup.lint,
    riseup.lintmd,
    riseup.coverage,
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  ),
  /* Hooks */
  prepublishOnly: create(() => tasks.validate),
  version: series(
    create(() => tasks.validate),
    riseup.build,
    riseup.docs
  )
};

module.exports = recreate({ announce: true }, tasks);
