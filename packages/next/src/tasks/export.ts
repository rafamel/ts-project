import { Deep, Empty } from 'type-core';
import { Task } from 'kpo';
import { nextTask } from './helpers/next-task';
import { hydrateNextGlobal } from '../global';

export interface ExportOptions {
  telemetry?: boolean;
}

export function hydrateExports(
  options: ExportOptions | Empty
): Deep.Required<ExportOptions> {
  const { telemetry } = hydrateNextGlobal(options);
  return { telemetry };
}

export function exportTask(options: ExportOptions | Empty): Task.Async {
  const opts = hydrateExports(options);

  return nextTask('export', opts, { babel: null });
}
