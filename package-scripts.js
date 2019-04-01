const path = require('path');
const project = require('./project.config');

/* Define functions */
const scripts = (x) => ({ scripts: x });
const ifelse = (x, a, b) => (x ? a || x : b || 'shx echo');
const series = (...x) => `(${x.map((y) => ifelse(y)).join(') && (')})`;

/* Get project config */
const dir = (file) => path.join(project.get('paths.root'), file);
const OUT_DIR = project.get('paths.output');
const TS = project.get('ext.ts') && project.get('typescript');
const EXT = TS
  ? project.get('ext.js') + ',' + project.get('ext.ts')
  : project.get('ext.js');
const DOT_EXT = '.' + EXT.replace(/,/g, ',.');
const { COMMIT, COMMITIZEN } = process.env;

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  build: {
    default: 'cross-env NODE_ENV=production nps validate build.dev',
    dev: 'webpack'
  },
  serve: {
    default: series(
      'jake tsr:isbuilt["nps build"]',
      `serve "${OUT_DIR}" -l 8080`
    ),
    json: `json-server ${dir('scripts/mock-db.json')} -p 3333 -w`
  },
  analyze: series(
    'jake tsr:isbuilt["nps build"]',
    `source-map-explorer "${OUT_DIR}/main.*.js" --only-mapped`
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
    format: [
      'prettier',
      `--write "./**/*.{${EXT},json,scss}"`,
      `--config "${dir('.prettierrc.js')}"`,
      `--ignore-path "${dir('.prettierignore')}"`
    ].join(' '),
    md:
      "mdspell --en-us '**/*.md' '!**/CHANGELOG.md' '!**/node_modules/**/*.md' '!**/lib/**/*.md'"
  },
  types: ifelse(TS, 'tsc'),
  lint: {
    default: `eslint ./src ./test --ext ${DOT_EXT} -c ${dir('.eslintrc.js')}`,
    md: series(
      `markdownlint README.md --config ${dir('markdown.json')}`,
      "mdspell -r --en-us '**/*.md' '!**/CHANGELOG.md' '!**/node_modules/**/*.md' '!**/lib/**/*.md'"
    ),
    scripts: 'jake lintscripts["' + project.get('paths.root') + '"]'
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
    `jake run:zero["shx rm -r \"${OUT_DIR}\" coverage CHANGELOG.md"]`,
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
