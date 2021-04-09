import { mkdir, remove, series, print, create, Task, exec } from 'kpo';
import { shallow } from 'merge-strategies';
import { Serial, Empty } from 'type-core';
import path from 'path';
import { tmpTask, getTypeScript, constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface DocsParams {
  build?: boolean;
  destination?: string;
}

export interface DocsOptions extends DocsParams {}

export interface DocsConfig {
  typedoc: Serial.Object;
}

export function docs(
  options: DocsOptions | Empty,
  config: DocsConfig
): Task.Async {
  const opts = shallow(
    {
      build: defaults.docs.build,
      destination: defaults.docs.destination
    },
    options || undefined
  );

  return create((ctx) => {
    if (!opts.build || !getTypeScript(ctx.cwd)) {
      return print('Skipped docs build');
    }

    return series(
      mkdir(opts.destination, { ensure: true }),
      remove(path.join(opts.destination, '*'), {
        glob: true,
        strict: false,
        recursive: true
      }),
      tmpTask(config.typedoc, (file) => {
        return exec(constants.node, [
          paths.bin.typedoc,
          'src',
          ...['--out', opts.destination],
          ...['--options', file]
        ]);
      })
    );
  });
}
