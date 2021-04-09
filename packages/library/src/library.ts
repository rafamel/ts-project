import { Empty, Serial, UnaryFn } from 'type-core';
import { merge } from 'merge-strategies';
import { context, Task } from 'kpo';
import { into } from 'pipettes';
import path from 'path';
import { getConfiguration } from '@riseup/utils';
import {
  configureReleaseit,
  GlobalUniversalOptions,
  universal,
  UniversalOptions,
  UniversalReconfigure,
  UniversalTasks
} from '@riseup/universal';
import {
  transpile,
  GlobalToolingOptions,
  ToolingOptions,
  ToolingReconfigure,
  ToolingTasks,
  configureBabel,
  tooling,
  configureTypescript
} from '@riseup/tooling';
import { defaults } from './defaults';
import { build, docs, BuildParams, DocsParams } from './tasks';
import {
  configurePika,
  configureTypedoc,
  ConfigurePikaParams,
  ConfigureTypedocParams
} from './configure';

export interface GlobalLibraryOptions
  extends GlobalUniversalOptions,
    GlobalToolingOptions {
  root?: string;
}

export interface LibraryOptions extends UniversalOptions, ToolingOptions {
  global?: GlobalLibraryOptions;
  build?: BuildParams & ConfigurePikaParams;
  docs?: DocsParams & ConfigureTypedocParams;
}

export interface LibraryReconfigure
  extends UniversalReconfigure,
    ToolingReconfigure {
  pika?: Serial.Array | UnaryFn<Serial.Array, Serial.Array>;
  typedoc?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface LibraryTasks extends UniversalTasks, ToolingTasks {
  build: Task;
  docs: Task;
}

export function library(
  options: LibraryOptions | Empty,
  reconfigure: LibraryReconfigure = {}
): LibraryTasks {
  const opts = into(
    { ...options },
    (opts: LibraryOptions) => ({
      ...opts,
      global: {
        ...opts.global,
        root: (opts.global && opts.global.root) || defaults.global.root
      }
    }),
    (opts) => ({
      ...opts,
      build: {
        ...opts.build,
        destination:
          (opts.build && opts.build.destination) || defaults.build.destination
      }
    }),
    (opts) => ({
      ...opts,
      transpile: {
        ...opts.transpile,
        output:
          (opts.transpile && opts.transpile.output) || defaults.transpile.output
      }
    }),
    (opts) => ({
      ...opts,
      release: merge(
        {
          publish: defaults.release.publish,
          overrides: {
            npm: { publishPath: opts.build.destination }
          }
        },
        opts.release
      )
    })
  );

  const wrap = context.bind(null, { cwd: opts.global.root });
  return into(
    {
      releaseit: getConfiguration<Serial.Object>(reconfigure.releaseit, () => {
        return configureReleaseit({ ...opts.release });
      }),
      babel: getConfiguration<Serial.Object>(reconfigure.babel, () => {
        return configureBabel({ ...opts.global, ...opts.transpile });
      }),
      typescript: getConfiguration<Serial.Object>(
        reconfigure.typescript,
        () => {
          return configureTypescript({ ...opts.global });
        }
      )
    },
    (config) => ({
      ...config,
      pika: getConfiguration<Serial.Array>(reconfigure.pika, () => {
        return configurePika(
          { ...opts.global, ...opts.transpile, ...opts.build },
          { babel: config.babel, typescript: config.typescript }
        );
      }),
      typedoc: getConfiguration<Serial.Object>(reconfigure.typedoc, () => {
        return configureTypedoc({ ...opts.global, ...opts.docs });
      })
    }),
    ({ releaseit, babel, typescript, pika, typedoc }) => ({
      ...universal(opts, { ...reconfigure, releaseit }),
      ...tooling(opts, { ...reconfigure, babel, typescript }),
      transpile: wrap(
        transpile(
          {
            ...opts.global,
            ...opts.transpile,
            output: path.join(opts.build.destination, opts.transpile.output)
          },
          { babel, typescript }
        )
      ),
      build: wrap(build({ ...opts.global, ...opts.build }, { pika, babel })),
      docs: wrap(docs({ ...opts.global, ...opts.docs }, { typedoc }))
    })
  );
}
