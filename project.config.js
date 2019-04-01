const fs = require('fs');
const path = require('path');
const { default: slim } = require('slimconf');

const PUBLIC_URL = '/';
const MANIFEST = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'public/app.webmanifest'))
);
module.exports = slim({
  publicUrl: PUBLIC_URL,
  generateSW: true,
  dev: {
    open: false, // Open browser on init
    port: 5000, // Warnings/errors on browser
    overlay: { warnings: false, errors: true }, // Warning / errors on CLI
    clientLogLevel: 'error',
    stats: 'minimal',
    watchOptions: {
      aggregateTimeout: 1000 // Wait 1000ms after changes ocurr
    }
  },
  assets: {
    maxSizeEntry: 300 * 1024, // 300kb; max size of a single file
    maxSize: 500 * 1024 // 500kb; max aggregate assets size
  },
  typescript: true,
  // Extensions allowed for each file type, as a comma separated string
  ext: {
    js: 'js,cjs,mjs,jsx',
    ts: 'ts,tsx',
    image: 'jpg,jpeg,png,gif,bmp',
    html: 'html',
    style: 'css,scss'
  },
  // Paths used on build
  paths: {
    root: __dirname,
    output: path.join(__dirname, 'build'),
    entry: path.join(__dirname, 'src/index.tsx'),
    assets: path.join(__dirname, 'public'),
    template: path.join(__dirname, 'public/index.html')
  },
  env: {
    // These will be required to exist on build via .env file or otherwise
    require: ['NODE_ENV'],
    // These will be made available on the html template (interpolated) and JS
    define: {
      NODE_ENV: process.env.NODE_ENV,
      PUBLIC_URL: PUBLIC_URL.replace(/(^\.)?\/$/, ''), // Removes last /
      /* Custom variables */
      ...Object.entries(MANIFEST).reduce((acc, [key, x]) => {
        if (typeof x === 'string') acc['MANIFEST_' + key.toUpperCase()] = x;
        return acc;
      }, {})
    }
  }
});
