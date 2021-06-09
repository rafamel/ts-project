import { create } from 'kpo';
import { hydrateUniversal, universal } from '@riseup/universal';
import { extract, Riseup, withReconfigure } from '@riseup/utils';
import { Empty } from 'type-core';
import {
  MonorepoConfigure,
  MonorepoOptions,
  MonorepoReconfigure,
  MonorepoTasks
} from './definitions';
import { link, run, execute, coverage, distribute } from './tasks';

export function hydrateMonorepo(
  options: MonorepoOptions | Empty
): Required<MonorepoOptions> {
  const universal = hydrateUniversal(options);
  const monorepo = options
    ? {
        distribute: { ...options.distribute },
        coverage: { ...options.coverage }
      }
    : {
        distribute: {},
        coverage: {}
      };

  return {
    ...universal,
    ...monorepo
  };
}

export function monorepo(
  options: MonorepoOptions | Empty,
  reconfigure: MonorepoReconfigure | Empty,
  fetcher: Riseup.Fetcher<MonorepoConfigure> | Empty
): MonorepoTasks {
  const opts = hydrateMonorepo(options);

  const deps = {
    universal: extract(universal, opts, reconfigure)
  };

  let configure: MonorepoConfigure = {
    ...deps.universal.configure
  };

  if (fetcher) fetcher(configure);
  configure = withReconfigure(configure, reconfigure);

  return {
    ...deps.universal.tasks,
    link: create(() => link()),
    run: create(() => run()),
    execute: create(() => execute()),
    coverage: create(() => coverage(opts.coverage)),
    distribute: create(() => distribute(opts.distribute))
  };
}
