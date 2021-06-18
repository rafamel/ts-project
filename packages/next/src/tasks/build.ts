import { Deep, Empty, Serial } from 'type-core';
import { context, Task } from 'kpo';
import { nextTask } from './helpers/next-task';
import { hydrateNextGlobal } from '../global';

export interface BuildOptions {
  telemetry?: boolean;
}

export interface BuildConfig {
  babel: Serial.Object;
}

export function hydrateBuild(
  options: BuildOptions | Empty
): Deep.Required<BuildOptions> {
  const { telemetry } = hydrateNextGlobal(options);
  return { telemetry };
}

export function build(
  options: BuildOptions | Empty,
  config: BuildConfig
): Task.Async {
  const opts = hydrateBuild(options);

  return context(
    (ctx) => ({ ...ctx, args: ['--no-lint', ...ctx.args] }),
    nextTask('build', opts, config)
  );
}
