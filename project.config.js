const path = require('path');
const { config } = require('slimconf');

// TODO modify slimconf so `config({ ... })` is possible
module.exports = config(undefined, () => ({
  typescript: true,
  // Extensions allowed for each file type, as a comma separated string
  ext: {
    js: 'js,cjs,mjs,jsx',
    ts: 'ts,tsx'
  },
  // Paths used on build
  paths: {
    root: __dirname,
    output: path.join(__dirname, 'lib'),
    docs: path.join(__dirname, 'docs')
  },
  release: {
    // Build project on version bump. Boolean.
    build: true,
    // Generate docs from TS on version bump. Boolean.
    docs: false
  }
}));
