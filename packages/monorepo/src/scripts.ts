import path from 'path';
import { DeepRequired } from 'utility-types';
import { IScriptsMonorepo, IOptionsMonorepo } from './types';
import { kpo, log, rm, ensure, line, silent } from 'kpo';
import {
  IScriptsCommon,
  route,
  bin,
  ENV_SEMANTIC,
  ENV_RELEASE,
  ENV_MONOREPO_VALIDATE,
  NODE_PATH
} from '@riseup/common';

export default function getScripts(
  common: IScriptsCommon,
  { packages }: DeepRequired<IOptionsMonorepo>
): IScriptsMonorepo {
  const vars = {
    semantic: !!process.env[ENV_SEMANTIC],
    validate: process.env[ENV_MONOREPO_VALIDATE]
  };

  const scripts: IScriptsMonorepo = {
    ...common,
    semantic: () => (args = []) => [
      bin('lerna', 'lerna', {
        args: [
          'version',
          '--no-push',
          '--no-commit-hooks',
          '--conventional-commits',
          ...args
        ],
        env: { [ENV_SEMANTIC]: '#' }
      })
    ],
    release: () => (args = []) => [
      bin('lerna', 'lerna', {
        args: [
          'publish',
          ...['--contents', packages.content],
          'from-package',
          ...args
        ],
        env: { [ENV_RELEASE]: '#' }
      }),
      ['git push', 'git push --tags']
    ],
    test: function() {
      return [
        kpo`:stream test`,
        (this && this['test:coverage']) || scripts['test:coverage']
      ];
    },
    'test:coverage': () => [
      log`Merging packages coverage reports`,
      [rm`coverage`, ensure`coverage`],
      line`
        kpo --log warn :stream :series
          "\\"${NODE_PATH}\\"
            \\"${route('lcov-result-merger', 'lcov-result-merger')}\\"
            \\"coverage/*.info\\"
            \\"${path.join(process.cwd(), 'coverage/lcov.dump.info')}\\""
          "\\"${NODE_PATH}\\"
            \\"${route('lcov-result-merger', 'lcov-result-merger')}\\"
            \\"${path.join(process.cwd(), 'coverage/*.info')}\\"
            \\"${path.join(process.cwd(), 'coverage/lcov.info')}\\""
      `,
      rm`coverage/lcov.dump.info`
    ],
    validate: function() {
      return [
        bin('lerna', 'lerna', { args: ['link'] }),
        vars.validate
          ? kpo`-d ${vars.validate} validate`
          : [
              (this && this['lint']) || scripts['lint'],
              silent`npm outdated`,
              kpo`:stream validate`,
              (this && this['test:coverage']) || scripts['test:coverage']
            ]
      ];
    },
    'pre-commit': function() {
      return [
        common['pre-commit'].bind(this),
        (this && this['validate']) || scripts['validate']
      ];
    },
    preversion: function() {
      return [
        common.preversion.bind(this),
        (this && this['validate']) || scripts['validate']
      ];
    },
    version: function() {
      return [!vars.semantic && Error(`Run semantic script`), 'git add .'];
    }
  };

  return scripts;
}
