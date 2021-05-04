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

export type UniversalReconfigure = {
  markdownlint?: Serial.Object | Riseup.Reconfigure<Serial.Object>;
};

export type UniversalConfigure = {
  markdownlint: Riseup.Configure<Serial.Object>;
};

export type UniversalTasks = {
  lintmd: Task;
  commit: Task;
  release: Task;
};
