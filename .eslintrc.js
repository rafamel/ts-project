const globals = require('eslint-restricted-globals');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'react-app',
    'standard',
    'plugin:import/errors',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  env: {
    node: true,
    jest: true
  },
  parserOptions: {
    impliedStrict: true
  },
  plugins: ['prettier', 'jest', 'import', 'babel'],
  globals: {},
  rules: {
    'react/prop-types': [2, { ignore: ['styles', 'theme', 'store'] }],
    'no-warning-comments': [
      1,
      { terms: ['xxx', 'fixme', 'todo', 'refactor'], location: 'start' }
    ],
    'no-console': 1,
    'jsx-a11y/no-autofocus': 0,
    'no-restricted-globals': [2, 'window', 'fetch'].concat(globals),
    // eslint-plugin-babel
    'babel/no-invalid-this': 1,
    'babel/semi': 1,
    // Prettier
    'prettier/prettier': [2, require('./.prettierrc')]
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16.6'
    },
    // babel-plugin-module-resolver
    'import/resolver': {
      'babel-module': {}
    }
  }
};
