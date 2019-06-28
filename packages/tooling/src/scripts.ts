import path from 'path';
import fs from 'fs-extra';
import { IOptionsTooling, IScriptsTooling } from '~/types';
import { DeepRequired } from 'utility-types';
import { IScriptsCommon, bin } from '@riseup/common';
import { extensions } from '~/utils';
import { series, silent, rm, line, copy, glob, ensure, log } from 'kpo';
import { ENV_OPTIONS_TOOLING, BUILD_TSCONFIG } from '~/constants';

export default function getScripts(
  common: IScriptsCommon,
  options: DeepRequired<IOptionsTooling>
): IScriptsTooling {
  const { typescript, paths, version, monorepo } = options;
  const ext = extensions({ typescript });

  const env = {
    [ENV_OPTIONS_TOOLING]: JSON.stringify(options)
  };

  const vars = {
    ...ext,
    comma: [...ext.js, ...ext.ts].join(','),
    dotcomma: [...ext.js, ...ext.ts].map((x) => '.' + x).join(',')
  };

  const scripts: IScriptsTooling = {
    ...common,
    /* Build */
    build: function() {
      return [
        rm(options.paths.build),
        ensure(options.paths.build),
        (this && this['build:transpile']) || scripts['build:transpile'],
        typescript && ((this && this['build:types']) || scripts['build:types'])
      ];
    },
    'build:transpile': () => (args = []) => {
      return bin('@babel/cli', 'babel', {
        env,
        args: [
          './src',
          ...['--config-file', require.resolve('./configure/babel')],
          ...['--out-dir', options.paths.build],
          ...['--source-maps', 'inline'],
          ...['--extensions', vars.dotcomma],
          ...args
        ]
      });
    },
    'build:types': () => (args = []) => {
      const tscf = fs.pathExistsSync(path.join(process.cwd(), BUILD_TSCONFIG));
      return typescript
        ? [
            bin('ttypescript', 'ttsc', {
              args: [
                ...(tscf ? ['--project', BUILD_TSCONFIG] : []),
                ...['--outDir', options.paths.build],
                ...args
              ]
            }),
            copy(glob`./src/**/*.d.ts`, {
              from: 'src',
              to: options.paths.build
            }),
            log`Types emitted`
          ]
        : log`Skipped types emit`;
    },
    /* Fix */
    fix: function() {
      return [
        (this && this['fix:code']) || scripts['fix:code'],
        common.fix.bind(this)
      ];
    },
    'fix:code': () => line`
      prettier --write ./**/*.{${vars.comma},json,scss}
    `,
    /* Lint */
    lint: function() {
      return [
        (this && this['lint:code']) || scripts['lint:code'],
        (typescript && (this && this['lint:types'])) || scripts['lint:types'],
        common.lint.bind(this)
      ];
    },
    'lint:code': () => (args = []) => [
      bin('eslint', 'eslint', {
        env,
        args: [
          ...['./src', './test'],
          ...['--config', require.resolve('./configure/eslint')],
          ...['--ext', vars.dotcomma],
          ...args
        ]
      })
    ],
    'lint:types': () => (args = []) => [
      typescript
        ? bin('ttypescript', 'ttsc', { args: ['--noEmit', ...args] })
        : log`Skipped type checks`
    ],
    /* Test */
    test: () => (args = []) => [
      bin('jest-cli', 'jest', {
        env: { ...env, NODE_ENV: 'test' },
        args: [
          ...['--config', require.resolve('./configure/jest')],
          ...['--rootDir', './'],
          ...args
        ]
      })
    ],
    validate: function() {
      return [
        (this && this['lint']) || scripts['lint'],
        (this && this['test']) || scripts['test'],
        silent`npm outdated`
      ];
    },
    /* Docs */
    docs: () => (args = []) => [
      typescript
        ? [
            rm(paths.docs),
            bin('typedoc', 'typedoc', {
              env,
              args: [
                './src',
                ...['--out', paths.docs],
                ...['--options', require.resolve('./configure/typedoc')],
                ...args
              ]
            })
          ]
        : log`Skipped typedoc build`
    ],
    precommit: function() {
      return [
        common.precommit.bind(this),
        (this && this['validate']) || scripts['validate']
      ];
    },
    version: function() {
      return [
        common.version.bind(this),
        monorepo ? [] : (this && this['validate']) || scripts['validate'],
        version.build && ((this && this['build']) || scripts.build),
        version.docs && typescript
          ? [
              (this && this['docs']) || scripts['docs'],
              series('git add', { args: [paths.docs] })
            ]
          : []
      ];
    }
  };

  return scripts;
}
