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
  ENV_MONOREPO_VERIFY,
  NODE_PATH
} from '@riseup/common';

export default function getScripts(
  common: IScriptsCommon,
  { packages }: DeepRequired<IOptionsMonorepo>
): IScriptsMonorepo {
  const vars = {
    semantic: !!process.env[ENV_SEMANTIC],
    verify: process.env[ENV_MONOREPO_VERIFY]
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
    test: () => [kpo`:stream test`, kpo`test:coverage`],
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
    verify: () => [
      bin('lerna', 'lerna', { args: ['link'] }),
      vars.verify
        ? kpo`-d ${vars.verify} verify`
        : [kpo`lint`, kpo`:stream verify`]
    ],
    validate: () => [
      kpo`lint`,
      silent`npm outdated`,
      kpo`:stream validate`,
      kpo`test:coverage`
    ],
    preversion: () => [common.preversion, kpo`validate`],
    version: () => [!vars.semantic && Error(`Run semantic script`), 'git add .']
  };

  return scripts;
}
