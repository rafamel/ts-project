import { Serial, UnaryFn } from 'type-core';
import { Task } from 'kpo';
import { LintParams, TranspileParams } from './tasks';
import {
  ConfigureBabelParams,
  ConfigureEslintParams,
  ConfigureJestParams
} from './configure';
import { ToolingGlobal } from './global';

export interface ToolingParams {
  global?: ToolingGlobal;
  transpile?: ConfigureBabelParams & TranspileParams;
  lint?: ConfigureEslintParams & LintParams;
  test?: ConfigureJestParams;
}

export type ToolingOptions = ToolingParams;

export interface ToolingReconfigure {
  babel?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  typescript?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  eslint?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  jest?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface ToolingTasks {
  transpile: Task;
  node: Task;
  lint: Task;
  test: Task;
}
