import { Empty, Serial, UnaryFn } from 'type-core';
import { context, Task } from 'kpo';
import { shallow } from 'merge-strategies';
import { getConfiguration } from '@riseup/utils';
import { defaults } from './defaults';
import {
  configureMarkdownlint,
  ConfigureMarkdownlintParams
} from './configure';
import {
  commit,
  semantic,
  changelog,
  lintmd,
  CommitParams,
  SemanticParams,
  ChangelogParams,
  LintMdParams
} from './tasks';

export interface GlobalUniversalOptions {
  root?: string;
}

export interface UniversalOptions {
  global?: GlobalUniversalOptions;
  commit?: CommitParams;
  semantic?: SemanticParams;
  changelog?: ChangelogParams;
  lintmd?: LintMdParams & ConfigureMarkdownlintParams;
}

export interface UniversalReconfigure {
  markdownlint?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface UniversalTasks {
  lintmd: Task;
  commit: Task;
  semantic: Task;
  changelog: Task;
}

export function universal(
  options: UniversalOptions | Empty,
  reconfigure: UniversalReconfigure = {}
): UniversalTasks {
  const opts: UniversalOptions = shallow(
    {
      global: {},
      lintmd: {},
      commit: {},
      semantic: {},
      changelog: {}
    },
    options || undefined
  );

  const cwd = (opts.global && opts.global.root) || defaults.global.root;

  const config = {
    markdownlint: getConfiguration<Serial.Object>(
      reconfigure.markdownlint,
      () => configureMarkdownlint()
    )
  };

  const wrap = context.bind(null, { cwd });
  return {
    commit: wrap(commit({ ...opts.global, ...opts.commit })),
    semantic: wrap(semantic({ ...opts.global, ...opts.semantic })),
    changelog: wrap(changelog({ ...opts.global, ...opts.changelog })),
    lintmd: wrap(
      lintmd(
        { ...opts.global, ...opts.lintmd },
        { markdownlint: config.markdownlint }
      )
    )
  };
}
