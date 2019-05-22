const { addHook } = require('pirates');

let remove;
module.exports = function hook(project = require.resolve('../project.config')) {
  if (remove) remove();

  remove = addHook(
    (code, filename) => {
      return code.replace(
        /require\(['"]\.\/project\.config(\.[a-zA-Z])?['"]\)/,
        `{ ...require('${project}'), esnext: false }`
      );
    },
    { exts: ['.js'], matcher: () => true }
  );
};
