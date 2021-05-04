import { Empty } from 'type-core';
import { create } from 'kpo';
import { Riseup, withReconfigure } from '@riseup/utils';
import {
  UniversalConfigure,
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
  reconfigure: UniversalReconfigure | Empty,
  fetcher: Riseup.Fetcher<UniversalConfigure> | Empty
): UniversalTasks {
  const opts = hydrateUniversal(options);

  let configure: UniversalConfigure = {
    markdownlint() {
      return configureMarkdownlint(opts.lintmd);
    }
  };

  if (fetcher) fetcher(configure);
  configure = withReconfigure(configure, reconfigure);

  return {
    lintmd: create(({ cwd }) => {
      return lintmd(opts.lintmd, {
        markdownlint: configure.markdownlint({ cwd, task: 'lintmd' })
      });
    }),
    commit: create(() => commit(opts.commit)),
    release: create(() => release(opts.release))
  };
}
