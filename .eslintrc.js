const globals = require('eslint-restricted-globals');
const project = require('./project.config');
const { configs: ts } = require('@typescript-eslint/eslint-plugin');

module.exports = {
  root: true,
  extends: [
    'react-app',
    'standard',
    'plugin:import/errors',
    'plugin:jsx-a11y/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  env: {
    browser: true,
    jest: true
  },
  parserOptions: {
    impliedStrict: true,
    sourceType: 'module'
  },
  plugins: ['prettier', 'jest', 'import'],
  globals: {},
  rules: {
    /* REACT */
    'react/prop-types': [2, { ignore: ['styles', 'theme', 'store'] }],
    /* DISABLED */
    'standard/no-callback-literal': 0,
    /* WARNINGS */
    'no-warning-comments': [
      1,
      { terms: ['xxx', 'fixme', 'todo', 'refactor'], location: 'start' }
    ],
    'no-unused-vars': 1,
    'no-console': 1,
    /* ERRORS */
    // Add custom globals
    'no-restricted-globals': [2, 'fetch'].concat(globals),
    // Prettier
    'prettier/prettier': [2, require('./.prettierrc')]
  },
  settings: {
    react: {
      pragma: 'React',
      version: '16.6'
    },
    'import/resolver': {
      node: {
        extensions: ['json']
          .concat(project.ext.js.split(','))
          .concat(project.ext.ts.split(','))
          .filter(Boolean)
          .map((x) => '.' + x)
      }
    }
  },
  overrides: [
    /* JAVASCRIPT */
    {
      files: [`*.{${project.ext.js}}`],
      parser: 'babel-eslint',
      plugins: ['babel'],
      rules: {
        'babel/no-invalid-this': 1,
        'babel/semi': 1
      },
      settings: {
        // babel-plugin-module-resolver
        'import/resolver': {
          'babel-module': {}
        }
      }
    },
    /* TYPESCRIPT */
    {
      files: [`*.{${project.ext.ts}}`],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      // Overrides don't allow for extends
      rules: Object.assign(ts.recommended.rules, {
        /* DISABLED */
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/no-object-literal-type-assertion': 0,
        /* WARNINGS */
        '@typescript-eslint/camelcase': 1,
        '@typescript-eslint/explicit-function-return-type': 1,
        '@typescript-eslint/no-unused-vars': [
          1,
          {
            args: 'after-used',
            argsIgnorePattern: '_.*',
            ignoreRestSiblings: true
          }
        ],
        /* ERRORS */
        '@typescript-eslint/interface-name-prefix': [2, 'always'],
        '@typescript-eslint/no-use-before-define': [2, { functions: false }],
        '@typescript-eslint/array-type': [2, 'array-simple']
      }),
      settings: {
        // eslint-import-resolver-typescript
        'import/resolver': {
          typescript: {}
        }
      }
    }
  ]
};
