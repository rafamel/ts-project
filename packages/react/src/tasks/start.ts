import { Deep, Empty, Serial, TypeGuard } from 'type-core';
import { merge } from 'merge-strategies';
import { Task } from 'kpo';
import { cracoTask } from './helpers/craco-task';
import { hydrateReactGlobal } from '../global';
import { defaults } from '../defaults';
import { traverseObject } from './helpers/traverse-object';

export interface StartParams {
  lint?: boolean;
  /** See: https://webpack.js.org/configuration/dev-server/#devserver */
  server?: Serial.Object | null;
}

export interface StartOptions extends StartParams {
  webpack?: string | null;
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface StartConfig {
  babel: Serial.Object;
  eslint: Serial.Object;
}

export function hydrateStart(
  options: StartOptions | Empty
): Deep.Required<StartOptions> {
  const { webpack, extensions } = hydrateReactGlobal(options);
  const opts = merge(
    {
      lint: defaults.start.lint,
      server: defaults.start.server,
      webpack,
      extensions
    },
    options
  );

  traverseObject(opts.server, (item) => {
    if (TypeGuard.isFunction(item)) {
      throw Error(`Functions are not allowed as start server options`);
    }
  });

  return opts;
}

export function start(
  options: StartOptions | Empty,
  config: StartConfig
): Task.Async {
  return cracoTask('start', hydrateStart(options), config);
}
