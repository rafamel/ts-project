import { DeepRequired } from 'utility-types';
import { bin, ENV_RELEASE } from '@riseup/common';
import { IOptionsLibrary, IScriptsLibrary } from '~/types';
import { IScriptsTooling } from '@riseup/tooling';
import { rm, ensure, copy, json, series, read, confirm } from 'kpo';

export default function getScripts(
  tooling: IScriptsTooling,
  options: DeepRequired<IOptionsLibrary>
): IScriptsLibrary {
  const { typescript, monorepo, paths } = options;

  const vars = {
    release: process.env[ENV_RELEASE]
  };

  const scripts: IScriptsLibrary = {
    ...tooling,
    build: function() {
      return [
        (this && this['build:pack']) || scripts['build:pack'],
        (this && this['build:static']) || scripts['build:static'],
        (this && this['build:transpile']) || scripts['build:transpile'],
        typescript && ((this && this['build:types']) || scripts['build:types'])
      ];
    },
    'build:pack': () => (args = []) => [
      [rm(paths.build), ensure(paths.build)],
      read('.babelrc.js', ({ raw }) => {
        if (raw) return;
        throw Error(`Pack requires file .babelrc.js to exist at project root`);
      }),
      bin('@pika/pack', 'pack', {
        args: ['build', '--out', paths.build, ...args]
      })
    ],
    'build:static': () => [
      copy('./static', `${paths.build}/static`),
      json(`${paths.build}/package.json`, ({ json }) => {
        return json
          ? { ...json, files: (json.files || []).concat('static/') }
          : undefined;
      })
    ],
    'build:transpile': function() {
      return [
        tooling['build:transpile'].bind(this),
        json(`${paths.build}/package.json`, ({ json }) => {
          return json
            ? Object.assign(json, {
                main: 'dist/index.js',
                files: (json.files || [])
                  .filter((x: string) => x !== 'dist/')
                  .concat('dist/')
              })
            : undefined;
        })
      ];
    },
    'build:types': function() {
      return [
        tooling['build:types'].bind(this),
        typescript && [
          json(`${paths.build}/package.json`, ({ json }) => {
            return json
              ? Object.assign(json, {
                  types: 'dist/index.d.ts',
                  files: (json.files || [])
                    .filter((x: string) => x !== 'dist/')
                    .concat('dist/')
                })
              : undefined;
          })
        ]
      ];
    },
    release: () => [
      series('npm publish --dry-run', { cwd: paths.build, args: [] }),
      confirm({ no: Error() }),
      series('npm publish', { cwd: paths.build, env: { [ENV_RELEASE]: '#' } }),
      series(['git push', 'git push --tags'], { args: [] })
    ]
  };

  const monorepoScripts: Partial<IScriptsLibrary> = {
    release: () => [
      !vars.release && Error(`Run release script on monorepo root`)
    ]
  };

  return monorepo ? { ...scripts, ...monorepoScripts } : scripts;
}
