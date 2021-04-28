import { Deep, Empty, Serial } from 'type-core';
import { Task } from 'kpo';
import { cracoTask } from './helpers/craco-task';
import { hydrateReactGlobal } from '../global';

export interface BuildOptions {
  webpack?: string | null;
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface BuildConfig {
  babel: Serial.Object;
  typescript: Serial.Object;
  eslint: Serial.Object;
}

export function hydrateBuild(
  options: BuildOptions | Empty
): Deep.Required<BuildOptions> {
  const { webpack, extensions } = hydrateReactGlobal(options);
  return { webpack, extensions };
}

export function build(
  options: BuildOptions | Empty,
  config: BuildConfig
): Task.Async {
  const opts = hydrateBuild(options);

  return cracoTask('build', { ...opts, lint: false, server: null }, config);
}
