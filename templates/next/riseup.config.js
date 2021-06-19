const urljoin = require('url-join');
const { next } = require('@riseup/next');
const { publicUrl, manifest } = require('./application.config');

module.exports = next(
  {
    global: {
      prettier: true,
      telemetry: false,
      alias: { '@root': './src' }
    },
    favicons: {
      logo: 'public/assets/react.svg',
      urls: { assets: null, result: urljoin(publicUrl, 'vendor') },
      dest: { assets: 'public/vendor', result: 'src/vendor/meta.json' },
      favicons: {
        appName: manifest.name,
        appShortName: manifest.shortName,
        appDescription: manifest.description,
        ...manifest
      }
    },
    watch: { clear: true, include: ['./'] },
    explore: { dir: 'build' },
    size: { dir: 'build', limit: '512 kB' },
    fix: { dir: ['src/', 'test/'] },
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
