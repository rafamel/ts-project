const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (x) => `(${x.join(') && (')})`;

const OUT_DIR = 'build';

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  postinstall:
    'npm outdated || shx echo "\nUpdate dependencies: \'npm run update\'\n"',
  dev:
    'cross-env NODE_ENV=development concurrently "webpack-dev-server" "onchange \\"./src/**/*.{js,mjs,jsx,ts}\\" -i -- nps private.dev" -n webpack,linter -c blue,yellow',
  fix: `prettier --write "./**/*.{js,jsx,ts,json,scss}"`,
  lint: {
    default: 'eslint ./src --ext .js,.mjs,.jsx',
    test: 'eslint ./test --ext .js,.mjs,.jsx',
    md: 'markdownlint *.md --config markdown.json',
    scripts: 'jake lintscripts'
  },
  test: {
    default: 'nps lint.test && jest ./test/.*.test.js',
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
    dev: 'jake clear && nps lint',
    test_watch: `jake clear && nps test`,
    validate_last: `npm outdated || jake countdown`
  }
});
