const withPWA = require('next-pwa');
const { publicUrl, enablePwa } = require('./application.config');

// See: https://nextjs.org/docs/api-reference/next.config.js
module.exports = withPWA({
  distDir: 'build',
  cleanDistDir: true,
  basePath: publicUrl === '/' ? '' : publicUrl,
  compress: true,
  optimizeFonts: true,
  trailingSlash: false,
  reactStrictMode: true,
  generateEtags: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  pwa: {
    register: true,
    sw: 'vendor-sw.js',
    dest: 'public',
    scope: publicUrl,
    disable: process.env.NODE_ENV === 'development' ? true : !enablePwa
  },
  webpack: (config, _options) => ({ ...config })
});
