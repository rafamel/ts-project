const breakpoints = require('./breakpoints');
const { craco } = require('./project.config');

const extract = [
  // './public/**/*.html',
  // './src/**/*.html',
  // './src/**/*.jsx',
  // './src/**/*.tsx'
];

module.exports = {
  ...craco,
  style: {
    postcss: {
      plugins: [
        require('postcss-functions')({
          functions: { breakpoint: (n) => `min-width: ${breakpoints[n]}px` }
        }),
        // CSS purging should be the last registered plugin
        process.env.NODE_ENV === 'production' && extract.length
          ? require('@fullhuman/postcss-purgecss')({
              content: extract,
              defaultExtractor: (text) => text.match(/[A-Za-z0-9-_:/!]+/g) || []
            })
          : false
      ].filter(Boolean)
    }
  }
};
