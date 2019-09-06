import up from 'find-up';
import { extensions } from '~/utils';
import { configs } from '@typescript-eslint/eslint-plugin';
import { IOfType, IOptionsTooling } from '~/types';
import { DeepRequired } from 'utility-types';

export default function getEslint({
  typescript,
  assign,
  paths
}: DeepRequired<IOptionsTooling>): IOfType<any> {
  const ext = extensions({ typescript });
  const prettier = up.sync('.prettierrc', {
    cwd: paths.root || process.cwd(),
    type: 'file'
  });

  return {
    root: true,
    extends: [
      require.resolve('eslint-config-standard'),
      require.resolve('eslint-plugin-import/config/errors'),
      require.resolve('eslint-config-prettier')
    ],
    env: {
      node: true,
      jest: true
    },
    parserOptions: {
      impliedStrict: true,
      sourceType: 'module'
    },
    // TODO: relative plugins resolves on major eslint release:
    // https://github.com/eslint/eslint/issues/6237
    plugins: ['prettier', 'jest', 'import'],
    globals: {},
    rules: {
      /* DISABLED */
      'standard/no-callback-literal': 0,
      'standard/array-bracket-even-spacing': 0,
      'no-return-await': 0,
      /* WARNINGS */
      'no-warning-comments': [1, { terms: assign.todo, location: 'start' }],
      'no-unused-vars': 1,
      'no-console': 1,
      /* ERRORS */
      // Prettier
      'prettier/prettier': prettier ? [2, require(prettier)] : 0
    },
    settings: {
      'import/resolver': {
        alias: {
          map: Object.entries(assign.alias || {}),
          extensions: ['json']
            .concat(ext.js)
            .concat(ext.ts)
            .map((x) => '.' + x)
        }
      }
    },
    overrides: [
      /* JAVASCRIPT */
      {
        files: [`*.{${ext.js.join(',')}}`],
        parser: require.resolve('babel-eslint'),
        plugins: ['babel'],
        rules: {
          'babel/no-invalid-this': 1,
          'babel/semi': 1
        }
      },
      /* TYPESCRIPT */
      !typescript
        ? {}
        : {
            files: [`*.{${ext.ts.join(',')}}`],
            parser: require.resolve('@typescript-eslint/parser'),
            plugins: ['@typescript-eslint'],
            // Overrides don't allow for extends
            rules: {
              ...configs.recommended.rules,
              /* DISABLED */
              '@typescript-eslint/indent': 0,
              '@typescript-eslint/camelcase': 0,
              '@typescript-eslint/no-explicit-any': 0,
              '@typescript-eslint/no-object-literal-type-assertion': 0,
              '@typescript-eslint/interface-name-prefix': 0,
              /* WARNINGS */
              '@typescript-eslint/explicit-function-return-type': [
                1,
                { allowExpressions: true, allowTypedFunctionExpressions: true }
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
              '@typescript-eslint/no-use-before-define': [
                2,
                { functions: false }
              ],
              '@typescript-eslint/array-type': [2, 'array-simple']
            }
          }
    ]
  };
}
