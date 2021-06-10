import { merge } from 'merge-strategies';
import { Deep, Empty, Dictionary } from 'type-core';
import { defaults } from './defaults';

export interface ToolingGlobalParams {
  prettier?: boolean;
  alias?: Dictionary<string>;
  extensions?: {
    js?: string[];
    ts?: string[];
    assets?: string[];
    styles?: string[];
  };
}

export type ToolingGlobalOptions = ToolingGlobalParams;

export function hydrateToolingGlobal(
  options: ToolingGlobalOptions | Empty
): Deep.Required<ToolingGlobalOptions> {
  return merge(
    {
      prettier: defaults.global.prettier,
      alias: defaults.global.alias,
      extensions: defaults.global.extensions
    },
    options || undefined
  );
}
