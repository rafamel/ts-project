import { Deep, Empty } from 'type-core';
import { merge } from 'merge-strategies';
import { create, exec, Task } from 'kpo';
import path from 'path';
import { constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';
import { ensureProjectBuilt } from './helpers/ensure-project-built';
import { getRecursiveFiles } from './helpers/get-recursive-files';

export interface ExploreParams {
  dir?: string;
}

export type ExploreOptions = ExploreParams;

export function hydrateExplore(
  options: ExploreOptions | Empty
): Deep.Required<ExploreOptions> {
  return merge(
    {
      dir: defaults.explore.dir
    },
    options || undefined
  );
}

export function explore(options: ExploreOptions | Empty): Task.Async {
  const opts = hydrateExplore(options);

  return create(async (ctx) => {
    const dir = path.resolve(ctx.cwd, opts.dir);
    await ensureProjectBuilt(dir);

    const maps = await getRecursiveFiles(
      ['map'],
      ['server'],
      [path.join(dir, 'static')]
    );

    if (!maps.length) {
      throw Error(
        `Project must be built with source maps for exploration. ` +
          `Enable the productionBrowserSourceMaps option in next configuration.`
      );
    }

    return exec(constants.node, [
      paths.bin.sourceMapExplorer,
      path.join(opts.dir, 'static/chunks/**/*.*')
    ]);
  });
}
