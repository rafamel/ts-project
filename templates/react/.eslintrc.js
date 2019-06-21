const path = require('path');

module.exports = {
  extends: ['react-app', path.join(__dirname, 'setup/project/.eslintrc.js')],
  rules: {
    'react/prop-types': [2, { ignore: ['styles', 'theme', 'store'] }]
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: 'js,cjs,mjs,jsx,ts,tsx,json,jpg,jpeg,png,gif,bmp,html,css,scss'
          .split(',')
          .map((ext) => '.' + ext)
      }
    }
  }
};
