const { monorepo } = require('@riseup/monorepo');

module.exports = monorepo(
  {
    lintmd: {
      include: './README.md',
      overrides: {}
    },
    release: {
      preset: 'angular',
      changelog: true
    },
    distribute: {
      push: true,
      contents: 'pkg/'
    }
  },
  { markdownlint: (config) => config }
);
