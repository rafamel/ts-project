import { Deep, Empty, TypeGuard } from 'type-core';
import { merge } from 'merge-strategies';
import { create, Task } from 'kpo';
import { defaults } from '../../defaults';
import { cli } from './cli';

export interface ReleaseParams {
  preset?: string | null;
  changelog?: boolean;
}

export type ReleaseOptions = ReleaseParams;

export function hydrateRelease(
  options: ReleaseOptions | Empty
): Deep.Required<ReleaseOptions> {
  return merge(
    {
      preset: defaults.release.preset,
      changelog: defaults.release.changelog
    },
    options || undefined
  );
}

export function release(options: ReleaseOptions | Empty): Task.Async {
  const opts = hydrateRelease(options);
  return create(() => {
    return cli(
      TypeGuard.isString(opts.preset)
        ? { preset: opts.preset, changelog: opts.changelog }
        : null
    );
  });
}
