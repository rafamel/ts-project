import { Serial, Empty, Deep } from 'type-core';
import { shallow } from 'merge-strategies';
import { Task, exec } from 'kpo';
import { tmpTask, constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface LintMdParams {
  /** File, directory, or glob for files to include */
  include?: string;
  /** File, directory, or glob for files to exclude */
  exclude?: string;
}

export type LintMdOptions = LintMdParams;

export interface LintMdConfig {
  /** See: https://github.com/igorshubovych/markdownlint-cli#configuration */
  markdownlint: Serial.Object;
}

export function hydrateLintmd(
  options: LintMdOptions | Empty
): Deep.Required<LintMdOptions> {
  return shallow(
    {
      include: defaults.lintmd.include,
      exclude: defaults.lintmd.exclude
    },
    options || undefined
  );
}

export function lintmd(
  options: LintMdOptions | Empty,
  config: LintMdConfig
): Task.Async {
  const opts = hydrateLintmd(options);

  return tmpTask(config.markdownlint, (file) => {
    return exec(constants.node, [
      paths.bin.markdownlint,
      ...['--config', file],
      ...(opts.exclude ? ['--ignore', opts.exclude] : []),
      ...[opts.include || './']
    ]);
  });
}
