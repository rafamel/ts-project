const { recreate, lift, exec, catches, series, context } = require('kpo');
const riseup = require('./riseup.config');

const tasks = {
  link: riseup.link,
  run: riseup.run,
  execute: riseup.execute,
  lint: riseup.lintmd,
  coverage: riseup.coverage,
  commit: riseup.commit,
  release: riseup.release,
  distribute: riseup.distribute,
  validate: series(
    context({ args: ['validate'] }, riseup.run),
    riseup.lintmd,
    riseup.coverage,
    lift({ purge: true, mode: 'audit' }, () => tasks),
    catches({ level: 'silent' }, exec('npm', ['outdated']))
  ),
  /* Hooks */
  prepare: series(
    catches(null, exec('simple-git-hooks')),
    exec('lerna', ['bootstrap', '--ci']),
    exec('npm', ['run', 'build'], { cwd: './utils' }),
    exec('npm', ['run', 'build'], { cwd: './universal' }),
    exec('npm', ['run', 'build'], { cwd: './tooling' }),
    exec('npm', ['run', 'build'], { cwd: './react' }),
    exec('npm', ['run', 'build'], { cwd: './monorepo' }),
    exec('npm', ['run', 'build'], { cwd: './library' }),
    exec('npm', ['run', 'build'], { cwd: './cli' }),
    riseup.link
  )
};

module.exports = recreate({ announce: true }, tasks);
