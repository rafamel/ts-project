const {
  recreate,
  context,
  create,
  series,
  lift,
  exec,
  catches,
  log
} = require('kpo');
const riseup = require('./riseup.packages');

const tasks = {
  node: riseup.node,
  build: riseup.build,
  docs: riseup.docs,
  fix: riseup.fix,
  lint: series(riseup.lintmd, riseup.lint),
  test: create((ctx) => {
    return ctx.cwd.endsWith('react')
      ? log('warn', 'Skip test for react package')
      : riseup.test;
  }),
  commit: riseup.commit,
  release: context({ args: ['--no-verify'] }, riseup.release),
  distribute: riseup.distribute,
  validate: series(
    create(() => tasks.lint),
    create(() => tasks.test),
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  ),
  /* Hooks */
  version: series(
    create(() => tasks.validate),
    create(() => tasks.build),
    create(() => tasks.docs)
  )
};

module.exports = recreate({ announce: true }, tasks);
