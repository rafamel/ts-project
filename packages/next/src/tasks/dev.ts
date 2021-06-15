import { Deep, Empty, Serial } from 'type-core';
import { Task } from 'kpo';
import { nextTask } from './helpers/next-task';
import { hydrateNextGlobal } from '../global';

export interface DevOptions {
  telemetry?: boolean;
}

export interface DevConfig {
  babel: Serial.Object;
}

export function hydrateDev(
  options: DevOptions | Empty
): Deep.Required<DevOptions> {
  const { telemetry } = hydrateNextGlobal(options);
  return { telemetry };
}

export function dev(
  options: DevOptions | Empty,
  config: DevConfig
): Task.Async {
  const opts = hydrateDev(options);

  return nextTask('dev', opts, config);
}
