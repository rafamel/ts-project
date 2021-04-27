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

export interface ReactParams {
  global?: ReactGlobalParams;
}

export type ReactOptions = ReactParams & UniversalOptions & ToolingOptions;

export type ReactReconfigure = UniversalReconfigure & ToolingReconfigure;

export interface ReactTasks extends UniversalTasks, ToolingTasks {
  build: Task;
}
