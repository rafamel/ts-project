const { react } = require('@riseup/react');

module.exports = react(
  {
    global: {
      prettier: true,
      webpack: './webpack.config',
      alias: { '@root': './src' }
    },
    start: {
      lint: true,
      server: null
    },
    size: {
      limit: '512 kB'
    },
    fix: {
      dir: ['src/', 'test/']
    },
    lint: {
      types: true,
      dir: ['src/', 'test/'],
      highlight: ['fixme', 'todo', 'refactor'],
      rules: {}
    },
    lintmd: {
      include: './README.md',
      overrides: {}
    },
    test: {
      verbose: false,
      ignore: [],
      require: [],
      coverage: 'auto',
      threshold: 0,
      overrides: {}
    },
    release: {
      preset: 'angular',
      changelog: true
    }
  },
  {
    babel: (config) => config,
    typescript: (config) => config,
    eslint: (config) => config,
    jest: (config) => config,
    markdownlint: (config) => config
  }
);
