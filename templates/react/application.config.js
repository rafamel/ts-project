module.exports = {
  publicUrl: '/',
  manifest: {
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
    startUrl: '.',
    // Used in Android's task switcher.
    themeColor: '#ffffff',
    // Background for splash.
    background: '#31d484',
    // Apple status bar:  "black-translucent", "default", "black".
    appleStatusBarStyle: 'default'
  },
  fonts: {
    family: ['Quicksand', 'Montserrat'],
    filename: 'static/css/fonts.css'
  },
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  }
};
