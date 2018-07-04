const registerSx = (sx, _ = (global.SX = {})) =>
  Object.keys(sx).forEach((key) => (global.SX[key] = sx[key]));
const sx = (name) => `node -r ./package-scripts.js -e global.SX.${name}\\(\\)`;
const scripts = (x) => ({ scripts: x });
const exit0 = (x) => `${x} || shx echo `;
const series = (x) => `(${x.join(') && (')})`;
const intrim = (x) => x.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');

const cnf = {
  in: {
    src: './src',
    entry: './public/index.html',
    startup: './setup/devstart.html',
    dbMock: './setup/mock-db.json'
  },
  out: {
    dev: './dist',
    prod: './build'
  },
  port: {
    dev: 5000,
    prod: 5000
  }
};

process.env.LOG_LEVEL = 'disable';
module.exports = scripts({
  start: watch({ hmr: true, open: true, wait: 1500 }),
  dev: {
    default: watch({ hmr: false, open: false, wait: 1000 }),
    hmr: watch({ hmr: true, open: false, wait: 2000 }),
    json: `json-server ${cnf.in.dbMock} -p 3333 -w`
  },
  build: series([
    'nps validate',
    exit0(`shx rm -r ${cnf.out.prod}`),
    `parcel build ${cnf.in.entry} --public-url ./ -d ${cnf.out.prod} --no-cache`
  ]),
  serve: `serve ${cnf.out.prod} --port=${cnf.port.prod} --open`,
  analyze: `source-map-explorer ${cnf.out.prod}/src.*.js`,
  fix: `prettier --write "${cnf.in.src}/**/*.{js,jsx,ts,scss,md}"`,
  lint: {
    default: series([
      `eslint ${cnf.in.src} --ext .js`,
      'shx echo "No linting errors."'
    ]),
    md: 'markdownlint *.md --config markdown.json'
  },
  test: {
    default: 'jest --runInBand',
    watch: `onchange "${cnf.in.src}/**/*.{js,jsx}" -i -- nps private.test_watch`
  },
  validate: series([
    'nps fix lint lint.md',
    `npm outdated || ${sx('countdown')}`
  ]),
  update: 'npm update --save/save-dev && npm outdated',
  clean: series([
    exit0(`shx rm -r lib coverage .cache ${cnf.out.dev} ${cnf.out.prod}`),
    'shx rm -rf node_modules'
  ]),
  // Private
  private: {
    test_watch: `${sx('clear')} && nps test`
  }
});

registerSx({
  clear: () => console.log('\x1Bc'),
  countdown: (i = 8) => {
    if (!process.env.MSG) return;
    console.log('');
    const t = setInterval(() => {
      process.stdout.write('\r' + process.env.MSG + ' ' + i);
      !i-- && (clearInterval(t) || true) && console.log('\n');
    }, 1000);
  }
});

function watch({ hmr, open, wait }) {
  return series([
    exit0(`shx rm -r ${cnf.out.dev}`),
    `shx mkdir ${cnf.out.dev}`,
    `shx cp ${cnf.in.startup} ${cnf.out.dev}/index.html`,
    'concurrently "' +
      [
        `live-server ${cnf.out.dev} 
            --wait=${wait}
            --port=${cnf.port.dev}
            --ignore=${hmr ? '*.js,*.map' : 'service-worker.js,*.map'}
            ${open ? '' : '--no-browser'}`,
        `parcel watch ${cnf.in.entry} 
            -d ${cnf.out.dev} 
            --public-url ./ 
            --no-autoinstall
            ${hmr ? '' : '--no-hmr'}`,
        `onchange '${cnf.in.src}/**/*.{js,jsx}' -i -- nps lint`
      ]
        .map(intrim)
        .join('" "') +
      '" -n server,parcel,eslint -c blue,gray,yellow'
  ]);
}
