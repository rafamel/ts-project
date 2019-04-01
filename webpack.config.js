const { requireEnv } = require('slimconf');
const mergewith = require('lodash.mergewith');
const defaults = require('./scripts/webpack/defaults');
const development = require('./scripts/webpack/development');
const production = require('./scripts/webpack/production');
const project = require('./project.config.js');

// Require
requireEnv(...project.get('env.require'));

module.exports = mergewith(
  process.env.NODE_ENV === 'production' ? production : development,
  defaults,
  (obj, src) => (Array.isArray(obj) ? obj.concat(src) : undefined)
);
