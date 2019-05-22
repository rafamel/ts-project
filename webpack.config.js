const mergewith = require('lodash.mergewith');
const defaults = require('./setup/webpack/defaults');
const development = require('./setup/webpack/development');
const production = require('./setup/webpack/production');
const project = require('./project.config.js');
const { envs } = require('slimconf');

// Require
envs.assert(...project.get('env.require'));

module.exports = mergewith(
  process.env.NODE_ENV === 'production' ? production : development,
  defaults,
  (obj, src) => (Array.isArray(obj) ? obj.concat(src) : undefined)
);
