import { Deep, Empty } from 'type-core';
import { merge } from 'merge-strategies';
import { create, exec, Task } from 'kpo';
import path from 'path';
import { constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';
import { ensureProjectBuilt } from './helpers/ensure-project-built';
import { getRecursiveFiles } from './helpers/get-recursive-files';

export interface AnalyzeParams {
  dir?: string;
}

export type AnalyzeOptions = AnalyzeParams;

export function hydrateAnalyze(
  options: AnalyzeOptions | Empty
): Deep.Required<AnalyzeOptions> {
  return merge(
    {
      dir: defaults.analyze.dir
    },
    options || undefined
  );
}

export function analyze(options: AnalyzeOptions | Empty): Task.Async {
  const opts = hydrateAnalyze(options);

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
        `Project must be built with source maps for analysis. ` +
          `Enable the productionBrowserSourceMaps option in next configuration.`
      );
    }

    return exec(constants.node, [
      paths.bin.sourceMapExplorer,
      path.join(opts.dir, 'static/chunks/**/*.*')
    ]);
  });
}
