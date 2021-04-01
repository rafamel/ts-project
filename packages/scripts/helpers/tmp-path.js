const fs = require('fs');
const path = require('path');
const paths = require('../paths');
const hash = require('object-hash');
const { v4: uuid } = require('uuid');

module.exports = function tmpPath(seed, ext) {
  try {
    fs.accessSync(paths.riseup.tmp, fs.F_OK);
  } catch (err) {
    if (err) fs.mkdirSync(paths.riseup.tmp);
  }

  return path.join(
    paths.riseup.tmp,
    (seed
      ? hash(seed, {
          excludeValues: false,
          encoding: 'hex',
          ignoreUnknown: false,
          respectFunctionProperties: true,
          respectFunctionNames: true,
          respectType: true
        })
      : uuid()) + (ext || '')
  );
};
