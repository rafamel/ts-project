import { Empty, Serial, UnaryFn } from 'type-core';
import { context, Task } from 'kpo';
import { shallow } from 'merge-strategies';
import { getConfiguration } from '@riseup/utils';
import { defaults } from './defaults';
import {
  configureMarkdownlint,
  configureReleaseit,
  ConfigureMarkdownlintParams,
  ConfigureReleaseitParams
} from './configure';
import {
  commit,
  lintmd,
  release,
  CommitParams,
  LintMdParams,
  ReleaseParams
} from './tasks';

export interface GlobalUniversalOptions {
  root?: string;
}

export interface UniversalOptions {
  global?: GlobalUniversalOptions;
  lintmd?: LintMdParams & ConfigureMarkdownlintParams;
  commit?: CommitParams;
  release?: ReleaseParams & ConfigureReleaseitParams;
}

export interface UniversalReconfigure {
  releaseit?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  markdownlint?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface UniversalTasks {
  lintmd: Task;
  commit: Task;
  release: Task;
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
      release: {}
    },
    options || undefined
  );

  const cwd = (opts.global && opts.global.root) || defaults.global.root;

  const config = {
    markdownlint: getConfiguration<Serial.Object>(
      reconfigure.markdownlint,
      () => configureMarkdownlint({ ...opts.global, ...opts.lintmd })
    ),
    releaseit: getConfiguration<Serial.Object>(reconfigure.releaseit, () =>
      configureReleaseit({ ...opts.global, ...opts.release })
    )
  };

  const wrap = context.bind(null, { cwd });
  return {
    lintmd: wrap(
      lintmd(
        { ...opts.global, ...opts.lintmd },
        { markdownlint: config.markdownlint }
      )
    ),
    commit: wrap(commit({ ...opts.global, ...opts.commit })),
    release: wrap(
      release(
        { ...opts.global, ...opts.release },
        { releaseit: config.releaseit }
      )
    )
  };
}
