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
import { NextGlobalParams } from './global';
import { SizeParams } from './tasks';
import { WatchParams } from './tasks/watch';

export interface NextParams {
  global?: NextGlobalParams;
  watch?: WatchParams;
  size?: SizeParams;
}

export type NextOptions = NextParams & UniversalOptions & ToolingOptions;

export type NextReconfigure = UniversalReconfigure & ToolingReconfigure;

export type NextConfigure = UniversalConfigure & ToolingConfigure;

export type NextTasks = UniversalTasks &
  ToolingTasks & {
    dev: Task;
    watch: Task;
    start: Task;
    build: Task;
    export: Task;
    size: Task;
    analyze: Task;
  };
