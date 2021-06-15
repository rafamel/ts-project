import { Deep, Empty } from 'type-core';
import { merge } from 'merge-strategies';
import { defaults } from './defaults';
import { hydrateToolingGlobal, ToolingGlobalOptions } from '@riseup/tooling';

export interface NextGlobalParams {
  telemetry?: boolean;
  stubs?: {
    assets?: string[];
    styles?: string[];
  };
}

export type NextGlobalOptions = NextGlobalParams & ToolingGlobalOptions;

export function hydrateNextGlobal(
  options: NextGlobalOptions | Empty
): Deep.Required<NextGlobalOptions> {
  const toolingGlobal = hydrateToolingGlobal(options);
  return merge(
    {
      ...toolingGlobal,
      telemetry: defaults.global.telemetry,
      stubs: {
        ...toolingGlobal.stubs,
        ...defaults.global.stubs
      }
    },
    options || undefined
  );
}
