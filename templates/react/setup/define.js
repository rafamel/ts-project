const path = require('path');
const fs = require('fs');
const decamelize = require('decamelize');
const breakpoints = require('../breakpoints');

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/app.webmanifest'))
);
module.exports = defineEnv({ ...manifest, ...breakpoints });

function defineEnv(envs) {
  const prefix = 'REACT_APP_';

  const app = Object.entries(envs);
  const response = {};
  trunk(app, true);
  return response;

  function trunk(entries, normalize = true) {
    for (let [key, val] of entries) {
      if (!['string', 'number'].includes(typeof val)) continue;

      if (normalize) {
        key = decamelize(key).toUpperCase();
        if (!key.startsWith(prefix)) key = `${prefix}${key}`;
      }
      const value = String(val);
      response[key] = value;
    }
  }
}
