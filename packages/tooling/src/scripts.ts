import path from 'path';
import fs from 'fs-extra';
import { IOptionsTooling, IScriptsTooling } from '~/types';
import { DeepRequired } from 'utility-types';
import { IScriptsCommon, bin } from '@riseup/common';
import { extensions } from '~/utils';
import { kpo, series, silent, rm, copy, glob, ensure, log } from 'kpo';
import {
  ENV_OPTIONS_TOOLING,
  BUILD_TSCONFIG,
  TOOLING_PACKAGE_ROOT
} from '~/constants';

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
        typescript ? kpo`build:transpile build:types` : kpo`build:transpile`
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
    fix: () => [common.fix, kpo`fix:code`],
    'fix:code': () => `prettier --write ./**/*.{${vars.comma},json,scss}`,
    /* Lint */
    lint: () => [
      typescript ? kpo`lint:code lint:types` : kpo`lint:code`,
      common.lint
    ],
    'lint:code': () => (args = []) => [
      bin('eslint', 'eslint', {
        env,
        args: [
          ...['./src', './test'],
          ...['--config', require.resolve('./configure/eslint')],
          ...['--ext', vars.dotcomma],
          ...['--resolve-plugins-relative-to', TOOLING_PACKAGE_ROOT],
          ...args
        ]
      })
    ],
    'lint:types': () => (args = []) => [
      typescript
        ? [
            bin('ttypescript', 'ttsc', { args: ['--noEmit', ...args] }),
            log`Successful type checks`
          ]
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
    verify: () => [kpo`lint`, kpo`test -- --coverage=false`],
    validate: () => [kpo`lint test`, silent`npm outdated`],
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
    version: () => [
      common.version,
      monorepo ? [] : kpo`validate`,
      version.build ? kpo`build` : [],
      version.docs && typescript
        ? [kpo`docs`, series('git add', { args: [paths.docs] })]
        : []
    ]
  };

  return scripts;
}
