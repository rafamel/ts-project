import { Task } from 'kpo';
import {
  ToolingOptions,
  ToolingReconfigure,
  ToolingTasks
} from '@riseup/tooling';
import {
  UniversalOptions,
  UniversalReconfigure,
  UniversalTasks
} from '@riseup/universal';
import { ReactGlobalParams } from './global';
import { StartParams, SizeParams } from './tasks';

export interface ReactParams {
  global?: ReactGlobalParams;
  start?: StartParams;
  size?: SizeParams;
}

export type ReactOptions = ReactParams & UniversalOptions & ToolingOptions;

export type ReactReconfigure = UniversalReconfigure & ToolingReconfigure;

export interface ReactTasks extends UniversalTasks, ToolingTasks {
  start: Task;
  build: Task;
  size: Task;
}
