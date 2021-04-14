import { configs } from '@typescript-eslint/eslint-plugin';
import { Deep, Empty, Members, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ConfigureEslintParams {
  prettier?: boolean;
  highlight?: string[];
  rules?: Serial.Object;
}

export interface ConfigureEslintOptions extends ConfigureEslintParams {
  alias?: Members<string>;
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface ConfigureEslintConfig {
  babel: Serial.Object;
  prettier?: Serial.Object;
}

export function hydrateConfigureEslint(
  options: ConfigureEslintOptions | Empty
): Deep.Required<ConfigureEslintOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      rules: defaults.lint.rules,
      prettier: defaults.lint.prettier,
      highlight: defaults.lint.highlight
    },
    options || undefined
  );
}

export function configureEslint(
  options: ConfigureEslintOptions | Empty,
  config: ConfigureEslintConfig
): Serial.Object {
  const opts = hydrateConfigureEslint(options);

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
      'no-warning-comments': [1, { terms: opts.highlight, location: 'start' }],
      'no-unused-vars': 1,
      'no-console': 1,
      /* ERRORS */
      // Prettier
      'prettier/prettier': opts.prettier
        ? config.prettier
          ? [2, config.prettier]
          : 2
        : 0
    },
    settings: {
      'import/resolver': {
        alias: {
          map: Object.entries(opts.alias || {}),
          extensions: ['json']
            .concat(opts.extensions.js)
            .concat(opts.extensions.ts)
            .map((x) => (x[0] === '.' ? x : '.' + x))
        }
      }
    },
    overrides: [
      /* JAVASCRIPT */
      {
        files: [`*.{${opts.extensions.js.join(',')}}`],
        parser: paths.eslint.parserBabel,
        plugins: ['babel'],
        parserOptions: { babelOptions: config.babel },
        rules: {
          'babel/no-invalid-this': 1,
          'babel/semi': 1
        }
      },
      /* TYPESCRIPT */
      {
        files: [`*.{${opts.extensions.ts.join(',')}}`],
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
    ]
  };
}
