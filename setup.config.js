const fs = require('fs');
const path = require('path');

const manifest = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/app.webmanifest'))
);
module.exports = {
  publicUrl: '/',
  generateSW: true,
  dev: {
    port: 5000,
    overlay: { warnings: true, errors: true }
  },
  assets: {
    maxSizeEntry: 300 * 1024, // 300kb
    maxSize: 500 * 1024 // 500kb
  },
  // Paths used for webpack build
  paths: {
    base: __dirname,
    output: path.join(__dirname, 'build'),
    entry: path.join(__dirname, 'src/index.js'),
    assets: path.join(__dirname, 'public'),
    template: path.join(__dirname, 'public/index.html')
  },
  get env() {
    return {
      // These will be required to exist on build via .env file or otherwise
      require: ['NODE_ENV'],
      // These will be made available on the html template (interpolated) and JS
      define: {
        NODE_ENV: process.env.NODE_ENV,
        PUBLIC_URL: this.publicUrl.replace(/(^\.)?\/$/, ''), // Removes last /
        // Custom vars

        // Manifest: MANIFEST_...
        ...Object.entries(manifest).reduce((acc, [key, x]) => {
          if (typeof x === 'string') acc['MANIFEST_' + key.toUpperCase()] = x;
          return acc;
        }, {})
      }
    };
  }
};
