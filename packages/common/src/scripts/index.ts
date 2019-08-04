import path from 'path';
import fs from 'fs-extra';
import up from 'find-up';
import chalk from 'chalk';
import { IOptionsCommon, IScriptsCommon } from '~/types';
import { bin } from '~/utils';
import { DeepRequired } from 'utility-types';
import { promisify } from 'util';
import bump from 'conventional-recommended-bump';
import { kpo, remove, log, confirm, series } from 'kpo';
import {
  ENV_RELEASE,
  ENV_SEMANTIC,
  ENV_COMMITIZEN,
  ENV_MONOREPO_VALIDATE,
  NODE_PATH
} from '~/constants';

export default function getScripts({
  paths,
  clean,
  monorepo
}: DeepRequired<IOptionsCommon>): IScriptsCommon {
  const vars = {
    commit: !!process.env[ENV_COMMITIZEN] || !!process.env[ENV_SEMANTIC],
    semantic: !!process.env[ENV_SEMANTIC],
    release: !!process.env[ENV_RELEASE]
  };

  const scripts: IScriptsCommon = {
    /* Repo */
    commit: () => (args = []) => [
      series(NODE_PATH, {
        args: [require.resolve('./git-cz'), ...args],
        env: { [ENV_COMMITIZEN]: '#' }
      })
    ],
    semantic: () => async ([type]: any) => {
      const { reason, releaseType } = await promisify(bump)({
        preset: 'angular'
      });
      type ? log.fn`\nVersion bump: ${type}` : log.fn``;
      log.fn`Recommended version bump: ${releaseType}\n    ${reason}`;
      return confirm({
        no: Error(),
        yes: series.env(`npm version ${type ? '' : releaseType}`, {
          [ENV_SEMANTIC]: '#'
        })
      });
    },
    /* Fix */
    fix: function() {
      return [(this && this['fix:scripts']) || scripts['fix:scripts']];
    },
    'fix:scripts': kpo`:raise --purge --confirm --fail`,
    /* Lint */
    lint: function() {
      return [
        (this && this['lint:md']) || scripts['lint:md'],
        (this && this['lint:scripts']) || scripts['lint:scripts']
      ];
    },
    'lint:md': () => async (args = []) => {
      const readme = await fs.pathExists(path.join(paths.root, 'README.md'));
      if (!readme) return;

      let rc = await up('.markdownlintrc', { cwd: paths.root, type: 'file' });
      if (!rc) {
        const pkg = await up('package.json', { cwd: __dirname, type: 'file' });
        if (!pkg) throw Error(`Couldn't locate module package.json`);
        rc = path.join(path.dirname(pkg), 'static/.markdownlintrc');
      }

      return bin('markdownlint-cli', 'markdownlint', {
        args: ['README.md', '--config', rc, ...args]
      });
    },
    'lint:scripts': kpo`:raise --dry --fail`,
    /* Clean */
    clean: function() {
      return [
        (this && this['clean:build']) || scripts['clean:build'],
        (this && this['clean:modules']) || scripts['clean:modules']
      ];
    },
    'clean:build': remove(
      clean.map((x) => (path.isAbsolute(x) ? x : path.join(paths.root, x))),
      { confirm: true }
    ),
    'clean:modules': remove('./node_modules', { confirm: true }),
    /* Hooks */
    'pre-commit': () => !vars.commit && Error(`Run commit script`),
    prepublishOnly: () => !vars.release && Error(`Run release script`),
    preversion: () => !vars.semantic && Error(`Run semantic script`),
    version: () => (args = []) => [
      !vars.semantic && Error(`Run semantic script`),
      bin('conventional-changelog-cli', 'conventional-changelog', {
        args: ['-p', 'angular', '-i', 'CHANGELOG.md', '-s', 'r', '0', ...args]
      }),
      'git add CHANGELOG.md'
    ]
  };

  const monorepoScripts: Partial<IScriptsCommon> = {
    commit: () => [
      log`${chalk.bold.yellow('\nWARN:')} Validating only ${paths.root}`,
      series.env('kpo @root commit --', {
        [ENV_MONOREPO_VALIDATE]: paths.root
      })
    ],
    semantic: () => [
      !vars.semantic && Error(`Run semantic script on monorepo root`)
    ],
    // TODO: can be safely changed to "precommit" once husky
    // deprecates running scripts.precommit
    'pre-commit': () => Error(`Commit hooks should be set on monorepo root`),
    version: () => !vars.semantic && Error(`Run semantic script`)
  };

  return monorepo ? { ...scripts, ...monorepoScripts } : scripts;
}
