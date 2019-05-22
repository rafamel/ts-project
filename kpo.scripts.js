const hook = require('./setup/hook');
hook();

const { series, parallel, line, log, kpo } = require('kpo');
const { scripts, options } = require('./setup/project/kpo.scripts');
const project = require('./project.config');

module.exports.options = options;
module.exports.scripts = {
  ...scripts,
  build: {
    default: kpo`validate build.pack`,
    pack: series.env('webpack', { NODE_ENV: 'production' })
  },
  serve: {
    default: `serve ${project.get('paths.output')} -l 8080`,
    json: `json-server ./setup/mock-db.json -p 3333 -w`
  },
  analyze: line`source-map-explorer 
    ${project.get('paths.output')}/main.*.js --only-mapped`,
  watch: {
    default: parallel(
      [
        'webpack-dev-server',
        'onchange ./src --initial --kill -- kpo watch.task'
      ],
      {
        names: ['webpack', 'lint'],
        colors: ['blue', 'yellow'],
        env: { NODE_ENV: 'development' }
      }
    ),
    $task: [log`\x1Bc⚡`, kpo`lint types`]
  },
  release: [],
  docs: []
};
