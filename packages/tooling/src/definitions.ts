import { Serial } from 'type-core';
import { Task } from 'kpo';
import { Riseup } from '@riseup/utils';
import { FixParams, LintParams } from './tasks';
import {
  ConfigureEslintParams,
  ConfigureAvaParams,
  ConfigureNycParams
} from './configure';
import { ToolingGlobalParams } from './global';

export interface ToolingParams {
  global?: ToolingGlobalParams;
  fix?: FixParams;
  lint?: ConfigureEslintParams & LintParams;
  test?: ConfigureAvaParams;
  coverage?: ConfigureNycParams;
}

export type ToolingOptions = ToolingParams;

export interface ToolingReconfigure {
  babel?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
  typescript?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
  eslint?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
  ava?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
  nyc?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
}

export interface ToolingTasks {
  node: Task;
  fix: Task;
  lint: Task;
  test: Task;
  coverage: Task;
}
