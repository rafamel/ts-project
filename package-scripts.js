const series = (...x) => `(${x.map((x) => x || 'shx echo').join(') && (')})`;
// prettier-ignore
const scripts = (x) => Object.entries(x)
  .reduce((m, [k, v]) => (m.scripts[k] = v || 'shx echo') && m, { scripts: {} });
const { COMMIT, COMMITIZEN } = process.env;

const project = require('./project.config');
const OUT_DIR = project.paths.output;
const TS = Boolean(project.ext.ts);
const EXT = TS ? project.ext.js + ',' + project.ext.ts : project.ext.js;
const DOT_EXT = '.' + EXT.replace(/,/g, ',.');

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  build: {
    default: 'cross-env NODE_ENV=production nps validate build.dev',
    dev: 'webpack'
  },
  serve: {
    default: series(
      'jake tsr:isbuilt["nps build"]',
      `serve ${OUT_DIR} -l 8080`
    ),
    json: `json-server ./scripts/mock-db.json -p 3333 -w`
  },
  analyze: series(
    'jake tsr:isbuilt["nps build"]',
    `source-map-explorer ${OUT_DIR}/main.*.js --only-mapped`
  ),
  watch: [
    'cross-env NODE_ENV=development',
    'concurrently',
    '"webpack-dev-server"',
    `"onchange \\"./src/**/*.{${EXT}}\\" --initial --kill -- nps private.watch"`,
    '-n webpack,+ -c blue,gray'
  ].join(' '),
  fix: {
    default: 'nps fix.format fix.md',
    format: `prettier --write "./**/*.{${EXT},json,scss}"`,
    md:
      "mdspell --en-us '**/*.md' '!**/CHANGELOG.md' '!**/node_modules/**/*.md' '!**/lib/**/*.md'"
  },
  types: TS && 'tsc',
  lint: {
    default: `eslint ./src ./test --ext ${DOT_EXT}`,
    md: series(
      `markdownlint README.md --config 'markdown.json'`,
      "mdspell -r --en-us '**/*.md' '!**/CHANGELOG.md' '!**/node_modules/**/*.md' '!**/lib/**/*.md'"
    ),
    scripts: 'jake lintscripts["' + __dirname + '"]'
  },
  test: {
    default: series('nps lint types', 'cross-env NODE_ENV=test jest'),
    watch:
      `onchange "./{src,test}/**/*.{${EXT}}" --initial --kill -- ` +
      'jake clear run:exec["shx echo ⚡"] run:zero["nps test"]'
  },
  validate: series(
    // prettier-ignore
    COMMIT && !COMMITIZEN && 'jake run:conditional[' +
        `"\nCommits should be done via 'npm run commit'. Continue?",` +
        '"","exit 1",Yes,5]',
    'nps test lint.md lint.scripts',
    'jake run:zero["npm outdated"]',
    COMMIT && `jake run:conditional["\nCommit?","","exit 1",Yes,5]`
  ),
  changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s -r 0',
  update: series('npm update --save/save-dev', 'npm outdated'),
  clean: series(
    `jake run:zero["shx rm -r ${OUT_DIR} coverage CHANGELOG.md"]`,
    'shx rm -rf node_modules'
  ),
  // Private
  private: {
    watch: series(
      'jake clear run:exec["shx echo ⚡"]',
      'concurrently "nps lint" "nps types" -n eslint,tsc -c yellow,magenta'
    ),
    preversion: series(
      'shx echo "Recommended version bump is:"',
      'conventional-recommended-bump --preset angular --verbose',
      `jake run:conditional["\nContinue?","","exit 1",Yes]`
    ),
    version: series('nps changelog', 'git add .')
  }
});
