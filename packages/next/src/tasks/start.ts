import { Deep, Empty } from 'type-core';
import { Task } from 'kpo';
import { nextTask } from './helpers/next-task';
import { hydrateNextGlobal } from '../global';

export interface StartOptions {
  telemetry?: boolean;
}

export function hydrateStart(
  options: StartOptions | Empty
): Deep.Required<StartOptions> {
  const { telemetry } = hydrateNextGlobal(options);
  return { telemetry };
}

export function start(options: StartOptions | Empty): Task.Async {
  const opts = hydrateStart(options);
  return nextTask('start', opts, { babel: null });
}
