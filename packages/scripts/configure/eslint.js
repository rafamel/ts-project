const up = require('find-up');
const paths = require('../paths');
const { configs } = require('@typescript-eslint/eslint-plugin');

module.exports = function eslint(data) {
  const prettier = data.args.prettier
    ? up.sync('.prettierrc', {
        cwd: data.options.paths.root,
        type: 'file'
      })
    : null;

  return {
    extends: [
      paths.eslint.configStandard,
      paths.eslint.configImportErrors,
      paths.eslint.configPrettier
    ],
    env: {
      node: true,
      jest: true
    },
    parserOptions: {
      impliedStrict: true,
      sourceType: 'module'
    },
    plugins: ['prettier', 'jest', 'import'],
    globals: {},
    rules: {
      /* DISABLED */
      'no-return-await': 0,
      'lines-between-class-members': 0,
      'standard/no-callback-literal': 0,
      'standard/array-bracket-even-spacing': 0,
      /* WARNINGS */
      'no-warning-comments': [1, { terms: data.args.todo, location: 'start' }],
      'no-unused-vars': 1,
      'no-console': 1,
      /* ERRORS */
      // Prettier
      'prettier/prettier': prettier ? [2, require(prettier)] : 0
    },
    settings: {
      'import/resolver': {
        alias: {
          map: Object.entries(data.options.paths.alias || {}),
          extensions: ['json']
            .concat(data.options.extensions.js)
            .concat(data.options.extensions.ts)
            .map((x) => (x[0] === '.' ? x : '.' + x))
        }
      }
    },
    overrides: [
      /* JAVASCRIPT */
      {
        files: [`*.{${data.options.extensions.js.join(',')}}`],
        parser: paths.eslint.parserBabel,
        plugins: ['babel'],
        rules: {
          'babel/no-invalid-this': 1,
          'babel/semi': 1
        }
      }
    ].concat(
      /* TYPESCRIPT */
      {
        files: [`*.{${data.options.extensions.ts.join(',')}}`],
        parser: paths.eslint.parserTypeScript,
        plugins: ['@typescript-eslint'],
        // Overrides don't allow for extends
        rules: {
          ...configs.recommended.rules,
          /* DISABLED */
          'no-use-before-define': 0,
          '@typescript-eslint/indent': 0,
          '@typescript-eslint/camelcase': 0,
          '@typescript-eslint/no-explicit-any': 0,
          '@typescript-eslint/no-object-literal-type-assertion': 0,
          '@typescript-eslint/interface-name-prefix': 0,
          '@typescript-eslint/ban-ts-ignore': 0,
          '@typescript-eslint/no-empty-function': 0,
          '@typescript-eslint/no-empty-interface': 0,
          /* WARNINGS */
          '@typescript-eslint/explicit-function-return-type': [
            1,
            {
              allowExpressions: true,
              allowTypedFunctionExpressions: true
            }
          ],
          '@typescript-eslint/no-unused-vars': [
            1,
            {
              args: 'after-used',
              argsIgnorePattern: '_.*',
              ignoreRestSiblings: true
            }
          ],
          /* ERRORS */
          '@typescript-eslint/no-use-before-define': [2, { functions: false }],
          '@typescript-eslint/array-type': [
            2,
            { default: 'array-simple', readonly: 'array-simple' }
          ],
          '@typescript-eslint/no-inferrable-types': [
            2,
            { ignoreParameters: true, ignoreProperties: true }
          ]
        }
      }
    )
  };
};
