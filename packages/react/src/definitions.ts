import { Task } from 'kpo';
import {
  ToolingConfigure,
  ToolingOptions,
  ToolingReconfigure,
  ToolingTasks
} from '@riseup/tooling';
import {
  UniversalConfigure,
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

export type ReactConfigure = UniversalConfigure & ToolingConfigure;

export type ReactTasks = UniversalTasks &
  ToolingTasks & {
    start: Task;
    build: Task;
    size: Task;
    analyze: Task;
  };
