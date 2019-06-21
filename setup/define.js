const path = require('path');
const fs = require('fs');

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../public/app.webmanifest'))
);

const prefix = 'REACT_APP_';
module.exports = Object.entries({
  // Environment variables to be defined on run and interpolated on template
  ...manifest
})
  .filter(([_, val]) => val || typeof val === 'string')
  .reduce((o, [key, val]) => (o[prefix + key.toUpperCase()] = val) && o, {});
