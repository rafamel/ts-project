import { Deep, Empty } from 'type-core';
import { merge } from 'merge-strategies';
import { defaults } from './defaults';
import { hydrateToolingGlobal, ToolingGlobalOptions } from '@riseup/tooling';

export interface ReactGlobalParams {
  webpack?: string | null;
  transforms?: {
    assets?: string[];
    styles?: string[];
  };
}

export type ReactGlobalOptions = ReactGlobalParams & ToolingGlobalOptions;

export function hydrateReactGlobal(
  options: ReactGlobalOptions | Empty
): Deep.Required<ReactGlobalOptions> {
  const toolingGlobal = hydrateToolingGlobal(options);
  return merge(
    {
      ...toolingGlobal,
      webpack: defaults.global.webpack,
      transforms: {
        ...toolingGlobal.transforms,
        ...defaults.global.transforms
      }
    },
    options || undefined
  );
}
