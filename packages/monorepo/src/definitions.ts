import { Task } from 'kpo';
import {
  UniversalParams,
  UniversalReconfigure,
  UniversalTasks
} from '@riseup/universal';
import { DistributeParams } from './tasks';

export interface MonorepoParams {
  distribute?: DistributeParams;
}

export type MonorepoOptions = MonorepoParams & UniversalParams;

export type MonorepoReconfigure = UniversalReconfigure;

export interface MonorepoTasks extends UniversalTasks {
  distribute: Task;
}
