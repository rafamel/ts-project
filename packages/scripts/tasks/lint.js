const up = require('find-up');
const { exec, run } = require('kpo');
const tmpTask = require('../helpers/tmp-task');

module.exports = async function lint(data, context) {
  return run(
    context,
    tmpTask(data.config.eslint, async (file) => {
      const pkgPath = await up('package.json', {
        cwd: __dirname,
        type: 'file'
      });

      return exec(
        'eslint',
        [
          ...(Array.isArray(data.args.paths)
            ? data.args.paths
            : [data.args.paths]),
          ...['--config', file],
          ...[
            '--ext',
            [...data.options.extensions.js, ...data.options.extensions.ts]
              .map((x) => '.' + x)
              .join(',')
          ],
          ...['--resolve-plugins-relative-to', pkgPath]
        ],
        { cwd: data.options.paths.root }
      );
    })
  );
};
