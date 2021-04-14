import { merge } from 'merge-strategies';
import { Deep, Empty, Members } from 'type-core';
import { defaults } from './defaults';

export interface ToolingGlobal {
  alias?: Members<string>;
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export function hydrateToolingGlobal(
  options: ToolingGlobal | Empty
): Deep.Required<ToolingGlobal> {
  return merge(
    {
      alias: defaults.global.alias,
      extensions: defaults.global.extensions
    },
    options || undefined
  );
}