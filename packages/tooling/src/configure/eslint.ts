import { Deep, Empty, Dictionary, Serial } from 'type-core';
import { configs } from '@typescript-eslint/eslint-plugin';
import { merge } from 'merge-strategies';
import path from 'path';
import { tmpFile } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ConfigureEslintParams {
  dir?: string | string[];
  highlight?: string[];
  rules?: Serial.Object;
}

export interface ConfigureEslintOptions extends ConfigureEslintParams {
  prettier?: boolean;
  alias?: Dictionary<string>;
  extensions?: {
    js?: string[];
    ts?: string[];
    assets?: string[];
    styles?: string[];
  };
}

export interface ConfigureEslintConfig {
  babel: Serial.Object;
  typescript: Serial.Object;
  prettier: Serial.Object | null;
}

export function hydrateConfigureEslint(
  options: ConfigureEslintOptions | Empty
): Deep.Required<ConfigureEslintOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      dir: defaults.lint.dir,
      rules: defaults.lint.rules,
      highlight: defaults.lint.highlight
    },
    options || undefined
  );
}

export function configureEslint(
  cwd: string,
  options: ConfigureEslintOptions | Empty,
  config: ConfigureEslintConfig
): Serial.Object {
  const opts = hydrateConfigureEslint(options);
  const dir = Array.isArray(opts.dir) ? opts.dir : [opts.dir];
  const tsconfig = tmpFile('json', {
    ...config.typescript,
    include: dir.map((x) => path.resolve(cwd, x))
  });

  return {
    extends: [
      paths.eslint.configStandard,
      paths.eslint.configImportErrors,
      paths.eslint.configPrettier
    ],
    env: { node: true },
    parserOptions: {
      impliedStrict: true,
      sourceType: 'module'
    },
    plugins: ['prettier', 'import'],
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
            .concat(opts.extensions.assets)
            .concat(opts.extensions.styles)
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
        parserOptions: {
          project: tsconfig,
          tsconfigRootDir: cwd
        },
        plugins: ['@typescript-eslint'],
        // Overrides don't allow for extends
        rules: {
          ...configs.recommended.rules,
          /* DISABLED */
          'no-use-before-define': 0,
          'no-redeclare': 0,
          'import/export': 0,
          '@typescript-eslint/no-namespace': 0,
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
      },
      /* USER RULES */
      {
        files: ['*'],
        rules: opts.rules
      }
    ]
  };
}
