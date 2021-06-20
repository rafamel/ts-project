import { mkdir, remove, series, print, create, Task, exec } from 'kpo';
import { shallow } from 'merge-strategies';
import { Serial, Empty, Deep } from 'type-core';
import path from 'path';
import { temporal, getTypeScriptPath, constants } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface DocsParams {
  build?: boolean;
  destination?: string;
}

export type DocsOptions = DocsParams;

export interface DocsConfig {
  typedoc: Serial.Object;
}

export function hydrateDocs(
  options: DocsOptions | Empty
): Deep.Required<DocsOptions> {
  return shallow(
    {
      build: defaults.docs.build,
      destination: defaults.docs.destination
    },
    options || undefined
  );
}

export function docs(
  options: DocsOptions | Empty,
  config: DocsConfig
): Task.Async {
  const opts = hydrateDocs(options);

  return create((ctx) => {
    if (!opts.build || !getTypeScriptPath(ctx.cwd)) {
      return print('Skipped docs build');
    }

    return series(
      mkdir(opts.destination, { ensure: true }),
      remove(path.join(opts.destination, '*'), {
        glob: true,
        strict: false,
        recursive: true
      }),
      temporal(
        {
          ext: 'json',
          content: JSON.stringify(config.typedoc),
          overrides: ['typedoc.json', 'typedoc.js']
        },
        ([file]) => {
          return exec(constants.node, [
            paths.bin.typedoc,
            'src',
            ...['--out', opts.destination],
            ...['--options', file]
          ]);
        }
      )
    );
  });
}
