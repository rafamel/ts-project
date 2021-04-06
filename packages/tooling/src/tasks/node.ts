import { Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { exec, Task } from 'kpo';
import { tmpTask, constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface NodeOptions {
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface NodeConfig {
  babel: Serial.Object;
}

export function node(
  options: NodeOptions | Empty,
  config: NodeConfig
): Task.Async {
  const opts = merge(
    { extensions: defaults.global.extensions },
    options || undefined
  );

  return tmpTask(config.babel, (file) => {
    return exec(
      constants.bin.node,
      [
        paths.bin.babelNode,
        ...['--config-file', file],
        ...[
          '--extensions',
          [...opts.extensions.js, ...opts.extensions.ts]
            .map((x) => '.' + x)
            .join(',')
        ]
      ],
      { briefError: true }
    );
  });
}
