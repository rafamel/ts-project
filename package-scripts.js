const pkg = require('./package.json');
const path = require('path');
const dir = (file) => path.join(CONFIG_DIR, file);
const series = (...x) => `(${x.map((x) => x || 'shx echo').join(') && (')})`;
// prettier-ignore
const scripts = (x) => Object.entries(x)
  .reduce((m, [k, v]) => (m.scripts[k] = v || 'shx echo') && m, { scripts: {} });
const {
  TYPESCRIPT: TS,
  OUT_DIR,
  DOCS_DIR,
  CONFIG_DIR,
  BIN_DIR,
  BIN_ARCHS,
  EXT_JS,
  EXT_TS,
  RELEASE_BUILD,
  RELEASE_DOCS
} = require('./project.config');
const EXT = EXT_JS + ',' + EXT_TS;
const DOT_EXT = '.' + EXT.replace(/,/g, ',.');
const { COMMIT, CZ } = process.env;

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  build: series(
    'nps validate',
    `jake run:zero["shx rm -r ${OUT_DIR} ${BIN_DIR}"]`,
    `shx mkdir ${OUT_DIR}`,
    `jake fixpackage["${__dirname}","${OUT_DIR}",${Number(TS)}]`,
    'cross-env NODE_ENV=production nps private.babel',
    TS && `tsc --emitDeclarationOnly --outDir ${OUT_DIR}/typings`,
    TS && `shx cp -r ${OUT_DIR}/typings/src/* ${OUT_DIR}/`,
    TS && `shx rm -r ${OUT_DIR}/typings`,
    pkg.bin &&
      `pkg --out-path ${BIN_DIR} -t ${BIN_ARCHS} ${OUT_DIR}/package.json`
  ),
  publish: `cd ${OUT_DIR} && npm publish`,
  watch: series(
    `jake run:zero["shx rm -r ${OUT_DIR}"]`,
    `shx mkdir ${OUT_DIR}`,
    `onchange "./src/**/*.{${EXT}}" --initial --kill -- ` +
      `jake clear run:exec["shx echo ⚡"] run:zero["nps private.watch"]`
  ),
  fix: {
    default: 'nps fix.format fix.md',
    format: [
      'prettier',
      `--write "./**/*.{${EXT},.json,.scss}"`,
      `--config "${dir('.prettierrc.js')}"`,
      `--ignore-path "${dir('.prettierignore')}"`
    ].join(' '),
    md: "mdspell --en-us '**/*.md' '!**/node_modules/**/*.md'"
  },
  types: TS && 'tsc --noEmit',
  lint: {
    default: `eslint ./src ./test --ext ${DOT_EXT} -c ${dir('.eslintrc.js')}`,
    md: series(
      `markdownlint README.md --config ${dir('markdown.json')}`,
      "mdspell -r --en-us '**/*.md' '!**/node_modules/**/*.md'"
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
    COMMIT &&
      !CZ &&
      'jake run:conditional[' +
        `"\nCommits should be done via 'npm run commit'. Continue?",` +
        '"","exit 1",Yes,5]',
    'nps test lint.md lint.scripts',
    'jake run:zero["npm outdated"]',
    COMMIT && `jake run:conditional["\nCommit?","","exit 1",Yes,5]`
  ),
  docs:
    TS &&
    series(
      `jake run:zero["shx rm -r ${DOCS_DIR}"]`,
      `typedoc --out ${DOCS_DIR} ./src`
    ),
  changelog: 'conventional-changelog -p angular -i CHANGELOG.md -s',
  update: series('npm update --save/save-dev', 'npm outdated'),
  clean: series(
    `jake run:zero["shx rm -r ${OUT_DIR} ${DOCS_DIR} ${BIN_DIR} coverage CHANGELOG.md"]`,
    'shx rm -rf node_modules'
  ),
  // Private
  private: {
    preversion: series(
      'shx echo "Recommended version bump is:"',
      'conventional-recommended-bump --preset angular --verbose',
      `jake run:conditional["\nContinue?","","exit 1",Yes]`
    ),
    version: series(
      RELEASE_BUILD && 'nps build',
      RELEASE_DOCS && 'nps docs',
      'nps changelog',
      'git add .'
    ),
    babel: `babel src --out-dir ${OUT_DIR} --extensions ${DOT_EXT} --source-maps inline`,
    watch:
      'concurrently "nps lint" "nps types" "nps private.babel" -n eslint,tsc,babel -c yellow,magenta,green'
  }
});
