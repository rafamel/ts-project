import { Deep, Empty, Serial } from 'type-core';
import { create, exec, Task } from 'kpo';
import { tmpTask, constants } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
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

export function hydrateNode(
  options: NodeOptions | Empty
): Deep.Required<NodeOptions> {
  return hydrateToolingGlobal(options);
}

export function node(
  options: NodeOptions | Empty,
  config: NodeConfig
): Task.Async {
  const opts = hydrateNode(options);

  return create((ctx) => {
    return tmpTask('json', config.babel, (file) => {
      return exec(
        constants.node,
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
        { env: { NODE_ENV: ctx.env.NODE_ENV || 'development' } }
      );
    });
  });
}
