const assert = require('assert');

module.exports = {
  pipe: {
    'project.config.js': (src) => {
      assert(src.includes(`monorepo: true,`));
      assert(src.includes(`docs: path.join(__dirname, 'docs'),`));

      return (
        `const pkg = require('./package.json');\n` +
        src
          .replace('monorepo: false,', 'monorepo: true,')
          .replace(
            `docs: path.join(__dirname, 'docs'),`,
            `docs: path.join(__dirname, '../../docs', pkg.name),`
          )
      );
    }
  }
};
