import { Deep, Empty, TypeGuard } from 'type-core';
import { merge } from 'merge-strategies';
import { create, exec, log, series, Task } from 'kpo';
import path from 'path';
import { constants } from '@riseup/utils';
import { getRecursiveFiles } from './helpers/get-recursive-files';
import { defaults } from '../defaults';
import { paths } from '../paths';
import { ensureProjectBuilt } from './helpers/ensure-project-built';

export interface SizeParams {
  dir?: string;
  limit?: string | null;
}

export type SizeOptions = SizeParams;

export function hydrateSize(
  options: SizeOptions | Empty
): Deep.Required<SizeOptions> {
  return merge(
    {
      dir: defaults.size.dir,
      limit: defaults.size.limit
    },
    options || undefined
  );
}

export function size(options: SizeOptions | Empty): Task.Async {
  const opts = hydrateSize(options);

  return create(async (ctx) => {
    if (TypeGuard.isEmpty(opts.limit)) return null;

    const dir = path.resolve(ctx.cwd, opts.dir);
    await ensureProjectBuilt(dir);

    const files = await getRecursiveFiles(
      ['js', 'json'],
      ['server'],
      [path.join(dir, 'static')]
    );

    return series(
      log(
        'debug',
        'Checking aggregate size of: ' +
          files.map((file) => path.relative(ctx.cwd, file)).join(', ')
      ),
      exec(
        constants.node,
        [paths.bin.sizeLimit, ...['--limit', opts.limit], ...files],
        { cwd: paths.riseup.pkgNext }
      )
    );
  });
}
