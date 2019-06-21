const fs = require('fs');
const { promisify } = require('util');
const { series } = require('kpo');
const define = require('./define');

module.exports = function cra(...args) {
  return async (inner) => {
    const file = require.resolve(
      'react-scripts/scripts/utils/verifyTypeScriptSetup'
    );
    await promisify(fs.writeFile)(file, 'module.exports = function () {};');

    await series.fn('react-scripts', {
      env: define,
      args: (args || []).concat(inner)
    });
  };
};
