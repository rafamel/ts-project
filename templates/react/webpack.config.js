const { reconfigureWebpackStyles } = require('@riseup/react');
const { breakpoints, fonts } = require('./application.config');
const GoogleFontsPlugin = require('google-fonts-plugin');

module.exports = (webpack) => {
  return reconfigureWebpackStyles(
    {
      postcss: {
        plugins: [
          require('postcss-functions')({
            functions: {
              breakpoint: (n) => `min-width: ${breakpoints[n]}px`
            }
          })
        ]
      }
    },
    {
      ...webpack,
      plugins: [
        ...webpack.plugins,
        new GoogleFontsPlugin({
          fonts: fonts.family.map((name) => ({
            family: name,
            variants: [],
            subsets: ['latin-ext']
          })),
          encode: true,
          filename: fonts.filename,
          formats: ['woff', 'woff2']
        })
      ]
    }
  );
};
