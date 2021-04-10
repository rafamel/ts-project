import { Serial, UnaryFn } from 'type-core';
import { Task } from 'kpo';
import {
  ConfigureMarkdownlintParams,
  ConfigureReleaseitParams
} from './configure';
import { CommitParams, LintMdParams, ReleaseParams } from './tasks';

export interface UniversalParams {
  lintmd?: ConfigureMarkdownlintParams & LintMdParams;
  commit?: CommitParams;
  release?: ConfigureReleaseitParams & ReleaseParams;
}

export type UniversalOptions = UniversalParams;

export interface UniversalReconfigure {
  releaseit?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  markdownlint?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface UniversalTasks {
  lintmd: Task;
  commit: Task;
  release: Task;
}
