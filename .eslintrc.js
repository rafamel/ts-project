const hook = require('./setup/hook');
hook();

const eslint = require('./setup/project/.eslintrc');
const project = require('./project.config');
const pkg = require('./package.json');

module.exports = {
  ...eslint,
  extends: [
    'react-app',
    'standard',
    'plugin:import/errors',
    'plugin:react-app/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    jest: true
  },
  rules: {
    ...eslint.rules,
    'react/prop-types': [2, { ignore: ['styles', 'theme', 'store'] }]
  },
  settings: {
    ...eslint.settings,
    'import/resolver': {
      alias: {
        ...eslint.settings['import/resolver'].alias,
        extensions: eslint.settings['import/resolver'].alias.extensions.concat(
          []
            .concat(project.get('ext.image').split(','))
            .concat(project.get('ext.html').split(','))
            .concat(project.get('ext.style').split(','))
            .filter(Boolean)
            .map((x) => '.' + x)
        )
      }
    },
    react: {
      pragma: 'React',
      version: /[0-9.]+/
        .exec(pkg.dependencies.react)[0]
        .split('.')
        .slice(0, 2)
        .join('.')
    }
  }
};
