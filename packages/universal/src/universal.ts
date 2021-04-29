import { Empty } from 'type-core';
import { create } from 'kpo';
import { handleReconfigure, Riseup } from '@riseup/utils';
import {
  UniversalOptions,
  UniversalReconfigure,
  UniversalTasks
} from './definitions';
import { configureMarkdownlint } from './configure';
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
    markdownlint(context: Riseup.Context) {
      return handleReconfigure(
        context,
        { ...reconfigure },
        'markdownlint',
        () => configureMarkdownlint(opts.lintmd)
      );
    }
  };

  return {
    lintmd: create(({ cwd }) => {
      return lintmd(opts.lintmd, {
        markdownlint: configure.markdownlint({ cwd, task: 'lintmd' })
      });
    }),
    commit: create(() => {
      return commit(opts.commit);
    }),
    release: create(() => {
      return release(opts.release);
    })
  };
}
