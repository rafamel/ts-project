const config = require('./setup.config');
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (x) => `(${x.join(') && (')})`;

const OUT_DIR = config.paths.output;

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  postinstall:
    'npm outdated || shx echo "\nUpdate dependencies: \'npm run update\'\n"',
  build: 'cross-env NODE_ENV=production webpack',
  serve: series(['jake builtensure["nps build"]', `serve ${OUT_DIR} -l 8080`]),
  analyze: series([
    'jake builtensure["nps build"]',
    `source-map-explorer ${OUT_DIR}/main.*.js --only-mapped`
  ]),
  dev: {
    default: [
      'cross-env NODE_ENV=development',
      'concurrently',
      '"webpack-dev-server"',
      '"onchange \\"./src/**/*.{js,mjs,jsx,ts}\\" -i -- nps private.dev"',
      '-n webpack,linter -c blue,yellow'
    ].join(' '),
    json: `json-server ./scripts/mock-db.json -p 3333 -w`
  },
  fix: `prettier --write "./**/*.{js,mjs,jsx,ts,json,scss}"`,
  lint: {
    default: 'eslint ./src --ext .js,.mjs,.jsx',
    test: 'eslint ./test --ext .js,.mjs,.jsx',
    md: 'markdownlint *.md --config markdown.json',
    scripts: 'jake lintscripts'
  },
  test: {
    default: 'cross-env NODE_ENV=test nps lint.test && jest ./test/.*.test.js',
    watch:
      'onchange "./{test,src}/**/*.{js,mjs,jsx,ts}" -i -- nps private.test_watch'
  },
  validate:
    'nps fix lint lint.test lint.md lint.scripts test private.validate_last',
  update: 'npm update --save/save-dev && npm outdated',
  clean: series([
    exit0(`shx rm -r ${OUT_DIR} coverage`),
    'shx rm -rf node_modules'
  ]),
  // Private
  private: {
    dev: 'jake clear && echo "-- RUN --" && nps lint',
    test_watch: `jake clear && nps test`,
    validate_last: `npm outdated || jake countdown`
  }
});
