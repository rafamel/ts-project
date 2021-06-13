const { monorepo } = require('@riseup/monorepo');

module.exports = monorepo(
  {
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
