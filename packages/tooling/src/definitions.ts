import { Serial } from 'type-core';
import { Task } from 'kpo';
import { Riseup } from '@riseup/utils';
import { FixParams, LintParams } from './tasks';
import { ConfigureEslintParams, ConfigureJestParams } from './configure';
import { ToolingGlobalParams } from './global';

export interface ToolingParams {
  global?: ToolingGlobalParams;
  fix?: FixParams;
  lint?: ConfigureEslintParams & LintParams;
  test?: ConfigureJestParams;
}

export type ToolingOptions = ToolingParams;

export type ToolingReconfigure = {
  babel?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
  typescript?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
  eslint?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
  jest?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
};

export type ToolingConfigure = {
  babel: Riseup.Configure<Serial.Object>;
  typescript: Riseup.Configure<Serial.Object>;
  eslint: Riseup.Configure<Serial.Object>;
  jest: Riseup.Configure<Serial.Object>;
};

export type ToolingTasks = {
  node: Task;
  fix: Task;
  lint: Task;
  test: Task;
};
