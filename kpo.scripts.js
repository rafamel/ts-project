const { kpo, remove, series } = require('kpo');
const { scripts } = require('./project.config');

module.exports.scripts = {
  ...scripts,
  bootstrap: [
    series('npm i', { cwd: './packages' }),
    'lerna bootstrap',
    kpo`build`
  ],
  link: 'lerna link',
  build: [
    kpo`@common build`,
    kpo`@monorepo build`,
    kpo`@tooling build`,
    kpo`@library build`,
    kpo`@react build`
  ],
  'clean:modules': function() {
    return [
      remove('./packages/node_modules', { confirm: true }),
      scripts['clean:modules'].bind(this)
    ];
  },
  validate: function() {
    return [
      scripts.validate.bind(this),
      series('npm outdated', { cwd: './packages', silent: true })
    ];
  },
  /* Hooks */
  postinstall: kpo`bootstrap`
};
