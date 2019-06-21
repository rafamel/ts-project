const { line, kpo, series } = require('kpo');
const { scripts, options } = require('./setup/project/kpo.scripts');
const cra = require('./setup/cra');

module.exports.options = options;
module.exports.scripts = {
  ...scripts,
  build: {
    default: kpo`validate build.force`,
    force: {
      default: series.env('kpo build.force.task', { PUBLIC_URL: '/' }),
      $task: cra('build')
    }
  },
  serve: `serve ./build -l 8080`,
  analyze: line`source-map-explorer build/static/js/*.js --only-mapped`,
  watch: cra('start'),
  test: {
    ...scripts.test,
    force: cra('test', '--watchAll=false'),
    watch: cra('test')
  },
  release: [],
  docs: []
};
