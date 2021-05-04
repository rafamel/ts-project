import { Task } from 'kpo';
import {
  UniversalParams,
  UniversalReconfigure,
  UniversalTasks
} from '@riseup/universal';
import { CoverageParams, DistributeParams } from './tasks';

export interface MonorepoParams {
  distribute?: DistributeParams;
  coverage?: CoverageParams;
}

export type MonorepoOptions = MonorepoParams & UniversalParams;

export type MonorepoReconfigure = UniversalReconfigure;

export type MonorepoTasks = UniversalTasks & {
  run: Task;
  execute: Task;
  coverage: Task;
  distribute: Task;
};
