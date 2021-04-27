import { Serial, UnaryFn } from 'type-core';
import { Task } from 'kpo';
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
  babel?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  typescript?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  eslint?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  ava?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  nyc?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface ToolingTasks {
  node: Task;
  fix: Task;
  lint: Task;
  test: Task;
  coverage: Task;
}
