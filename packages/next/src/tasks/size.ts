import { Deep, Empty, TypeGuard } from 'type-core';
import { merge } from 'merge-strategies';
import { create, exec, Task } from 'kpo';
import path from 'path';
import fs from 'fs';
import { constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface SizeParams {
  limit?: string | null;
}

export type SizeOptions = SizeParams;

export function hydrateSize(
  options: SizeOptions | Empty
): Deep.Required<SizeOptions> {
  return merge({ limit: defaults.size.limit }, options);
}

export function size(options: SizeOptions | Empty): Task.Async {
  const opts = hydrateSize(options);

  return create((ctx) => {
    if (TypeGuard.isEmpty(opts.limit)) return null;

    const dir = path.resolve(ctx.cwd, 'build/static/js');

    try {
      fs.accessSync(dir, fs.constants.F_OK);
    } catch (_) {
      throw Error(`Project must be built before size checks`);
    }

    const files = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.js'))
      .map((file) => path.resolve(dir, file));

    return exec(
      constants.node,
      [paths.bin.sizeLimit, ...['--limit', opts.limit], ...files],
      { cwd: paths.riseup.pkgNext }
    );
  });
}
