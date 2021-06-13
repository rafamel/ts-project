import { merge } from 'merge-strategies';
import { Deep, Empty, Dictionary } from 'type-core';
import { defaults } from './defaults';

export interface ToolingGlobalParams {
  prettier?: boolean;
  alias?: Dictionary<string>;
  transforms?: {
    assets?: string[];
    styles?: string[];
  };
  extensions?: {
    js?: string[];
    ts?: string[];
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
      transforms: defaults.global.transforms,
      extensions: defaults.global.extensions
    },
    options || undefined
  );
}
