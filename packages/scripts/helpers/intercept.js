const fs = require('fs');
const path = require('path');
const mockery = require('mockery');
const { collect } = require('ensurism');

const env = collect(process.env, ({ ensure }) => ({
  RISEUP_INCERCEPT_ORIGINAL: ensure('string', { assert: true }),
  RISEUP_INTERCEPT_REPLACEMENT: ensure('string', { assert: true })
}));

const original = path.normalize(env.RISEUP_INCERCEPT_ORIGINAL);
const replacement = path.normalize(env.RISEUP_INTERCEPT_REPLACEMENT);

mockery.enable({
  warnOnReplace: true,
  warnOnUnregistered: false
});

mockery.registerMock(original, require(replacement));

mockery.registerMock('fs', {
  ...fs,
  access(file, ...args) {
    return fs.access(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  },
  accessSync(file, ...args) {
    return fs.accessSync(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  },
  readFile(file, ...args) {
    return fs.readFile(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  },
  readFileSync(file, ...args) {
    return fs.readFileSync(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  },
  stat(file, ...args) {
    return fs.stat(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  },
  statSync(file, ...args) {
    return fs.statSync(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  },
  lstat(file, ...args) {
    return fs.lstat(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  },
  lstatSync(file, ...args) {
    return fs.lstatSync(
      path.normalize(file) === original ? replacement : file,
      ...args
    );
  }
});
