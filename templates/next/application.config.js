const pkg = require('./package.json');

module.exports = {
  publicUrl: '/',
  enablePwa: true,
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  },
  manifest: {
    // Primary language
    lang: 'en-US',
    // Application version
    version: pkg.version,
    // Application id.
    id: 'id.riseup.template',
    // Application name.
    name: 'React Template Application',
    // Application short name.
    shortName: 'React Template',
    // Application description.
    description: 'Riseup React template',
    // Display mode: display mode: "fullscreen", "standalone", "minimal-ui" or "browser".
    display: 'standalone',
    // Orientation: "any", "natural", "portrait" or "landscape".
    orientation: 'any',
    // URLs to be considered within an app.
    scope: '/',
    // Start URL when launching from a device.
    start_url: '.',
    // Used in Android's task switcher.
    theme_color: '#ffffff',
    // Background for splash.
    background: '#ffffff',
    // Apple status bar:  "black-translucent", "default", "black".
    appleStatusBarStyle: 'default'
  }
};
