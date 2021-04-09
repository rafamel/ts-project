/* eslint-disable no-template-curly-in-string */
import { merge, shallow } from 'merge-strategies';
import { Empty, Serial } from 'type-core';
import { defaults } from '../defaults';

export interface ConfigureReleaseitParams {
  publish?: boolean;
  conventional?: {
    active?: boolean;
    preset?: string;
    changelog?: {
      file?: string;
      append?: boolean;
      releaseCount?: number;
      skipUnstable?: boolean;
    };
  };
  overrides?: Serial.Object;
}

export interface ConfigureReleaseitOptions extends ConfigureReleaseitParams {}

export function configureReleaseit(
  options: ConfigureReleaseitOptions | Empty
): Serial.Object {
  const opts = merge(
    {
      publish: defaults.release.publish,
      conventional: {
        active: defaults.release.conventional.active,
        preset: defaults.release.conventional.preset,
        changelog: defaults.release.conventional.changelog
      },
      overrides: defaults.release.overrides
    },
    options || undefined
  );

  const overrides = shallow({ hooks: {} }, opts.overrides || {});

  return merge(
    {
      hooks: {},
      git: {
        commit: true,
        tag: true,
        push: true,
        addUntrackedFiles: false,
        requireBranch: false,
        requireCommits: false,
        requireUpstream: true,
        requireCleanWorkingDir: false,
        ...(opts.conventional.active && opts.conventional.preset === 'angular'
          ? { commitMessage: 'chore(release): ${version}' }
          : {}),
        commitArgs: [],
        pushArgs: ['--follow-tags']
      },
      npm: {
        publish: opts.publish,
        publishPath: '.',
        publishArgs: []
      },
      github: {
        release: false
      },
      gitlab: {
        release: false
      },
      plugins: {
        ...(opts.conventional.active
          ? {
              '@release-it/conventional-changelog': {
                preset: opts.conventional.preset,
                infile: opts.conventional.changelog.file,
                outfile: opts.conventional.changelog.file,
                append: opts.conventional.changelog.append,
                skipUnstable: opts.conventional.changelog.skipUnstable
              }
            }
          : {})
      }
    },
    overrides
  );
}
