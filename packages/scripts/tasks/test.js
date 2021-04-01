const { exec, run } = require('kpo');
const tmpTask = require('../helpers/tmp-task');

module.exports = async function test(data, context) {
  return run(
    tmpTask(data.config.jest, async (file) => {
      return exec('jest', ['--config', file, '--rootDir', './'], {
        cwd: data.options.paths.root,
        briefError: true
      });
    }),
    context
  );
};
