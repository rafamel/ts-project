import { Serial } from 'type-core';
import { Task } from 'kpo';
import { Riseup } from '@riseup/utils';
import { ConfigureMarkdownlintParams } from './configure';
import { CommitParams, LintMdParams, ReleaseParams } from './tasks';

export interface UniversalParams {
  lintmd?: ConfigureMarkdownlintParams & LintMdParams;
  commit?: CommitParams;
  release?: ReleaseParams;
}

export type UniversalOptions = UniversalParams;

export interface UniversalReconfigure {
  markdownlint?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
}

export interface UniversalTasks {
  lintmd: Task;
  commit: Task;
  release: Task;
}
