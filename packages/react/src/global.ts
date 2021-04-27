import { Deep, Empty } from 'type-core';
import { merge } from 'merge-strategies';
import { defaults } from './defaults';
import { hydrateToolingGlobal, ToolingGlobalOptions } from '@riseup/tooling';

export interface ReactGlobalParams {
  webpack?: string | null;
}

export type ReactGlobalOptions = ReactGlobalParams & ToolingGlobalOptions;

export function hydrateReactGlobal(
  options: ReactGlobalOptions | Empty
): Deep.Required<ReactGlobalOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      webpack: defaults.global.webpack
    },
    options || undefined
  );
}
