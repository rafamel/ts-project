import { Empty, Serial } from 'type-core';
import { create } from 'kpo';
import { handleReconfigure } from '@riseup/utils';
import {
  UniversalOptions,
  UniversalReconfigure,
  UniversalTasks
} from './definitions';
import { configureMarkdownlint, configureReleaseit } from './configure';
import { commit, lintmd, release } from './tasks';

export function hydrateUniversal(
  options: UniversalOptions | Empty
): Required<UniversalOptions> {
  return options
    ? {
        lintmd: { ...options.lintmd },
        commit: { ...options.commit },
        release: { ...options.release }
      }
    : { lintmd: {}, commit: {}, release: {} };
}

export function universal(
  options: UniversalOptions | Empty,
  reconfigure?: UniversalReconfigure
): UniversalTasks {
  const opts = hydrateUniversal(options);

  const configure = {
    markdownlint() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.markdownlint,
        () => configureMarkdownlint(opts.lintmd)
      );
    },
    releaseit() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.releaseit,
        () => configureReleaseit(opts.release)
      );
    }
  };

  return {
    lintmd: create(() => {
      return lintmd(opts.lintmd, { markdownlint: configure.markdownlint() });
    }),
    commit: create(() => {
      return commit(opts.commit);
    }),
    release: create(() => {
      return release(opts.release, { releaseit: configure.releaseit() });
    })
  };
}
