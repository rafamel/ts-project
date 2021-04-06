import { Serial, Empty } from 'type-core';
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

export interface LintMdOptions extends LintMdParams {}

export interface LintMdConfig {
  /** See: https://github.com/igorshubovych/markdownlint-cli#configuration */
  markdownlint: Serial.Object;
}

export function lintmd(
  options: LintMdOptions | Empty,
  config: LintMdConfig
): Task.Async {
  const opts = shallow(
    {
      include: defaults.lintmd.include,
      exclude: defaults.lintmd.exclude
    },
    options || undefined
  );

  return tmpTask(config.markdownlint, (file) => {
    return exec(
      constants.bin.node,
      [
        paths.bin.markdownlint,
        ...['--config', file],
        ...(opts.exclude ? ['--ignore', opts.exclude] : []),
        ...[opts.include || './']
      ],
      { briefError: true }
    );
  });
}