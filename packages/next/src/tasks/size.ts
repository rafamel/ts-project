import { Deep, Empty, TypeGuard } from 'type-core';
import { merge } from 'merge-strategies';
import { create, exec, log, series, Task } from 'kpo';
import path from 'path';
import fs from 'fs';
import { constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

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
    options
  );
}

export function size(options: SizeOptions | Empty): Task.Async {
  const opts = hydrateSize(options);

  return create(async (ctx) => {
    if (TypeGuard.isEmpty(opts.limit)) return null;

    const dir = path.resolve(ctx.cwd, opts.dir);
    try {
      fs.accessSync(dir, fs.constants.F_OK);
    } catch (_) {
      throw Error(
        `Directory "${opts.dir}" doesn't exist. Project must be built before size checks.`
      );
    }

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

async function getRecursiveFiles(
  fileExt: string[],
  excludeDirNames: string[],
  dirs: string[]
): Promise<string[]> {
  if (!dirs.length) return [];

  const files: string[] = [];
  const dir = dirs[0];
  const pending = dirs.slice(1);

  const items = await new Promise<string[]>((resolve, reject) => {
    return fs.readdir(dir, (err, res) => (err ? reject(err) : resolve(res)));
  });
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = await new Promise<fs.Stats>((resolve, reject) => {
      return fs.stat(itemPath, (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    });
    if (stats.isDirectory()) {
      if (!excludeDirNames.includes(item)) pending.push(itemPath);
    } else {
      const ext = itemPath.split('.').slice(-1)[0];
      if (fileExt.includes(ext)) files.push(itemPath);
    }
  }

  return files.concat(
    await getRecursiveFiles(fileExt, excludeDirNames, pending)
  );
}
