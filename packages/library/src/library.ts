import { Empty } from 'type-core';
import { create } from 'kpo';
import { extract, Riseup, withReconfigure } from '@riseup/utils';
import { hydrateUniversal, universal } from '@riseup/universal';
import { hydrateTooling, tooling, reconfigureBabelEnv } from '@riseup/tooling';
import { build, distribute, docs } from './tasks';
import { configurePika, configureTypedoc } from './configure';
import {
  LibraryConfigure,
  LibraryOptions,
  LibraryReconfigure,
  LibraryTasks
} from './definitions';
import { defaults } from './defaults';

export function hydrateLibrary(
  options: LibraryOptions | Empty
): Required<LibraryOptions> {
  const universal = hydrateUniversal(options);
  const tooling = hydrateTooling(options);
  const library = options
    ? {
        build: { ...options.global, ...options.build },
        docs: { ...options.docs },
        distribute: { ...options.distribute }
      }
    : { build: {}, docs: {}, distribute: {} };

  return {
    ...universal,
    ...tooling,
    ...library,
    distribute: {
      ...library.distribute,
      contents:
        library.distribute.contents ||
        library.build.destination ||
        defaults.distribute.contents
    }
  };
}

export function library(
  options: LibraryOptions | Empty,
  reconfigure: LibraryReconfigure | Empty,
  fetcher: Riseup.Fetcher<LibraryConfigure> | Empty
): LibraryTasks {
  const opts = hydrateLibrary(options);

  const deps = {
    universal: extract(universal, opts, reconfigure),
    tooling: extract(tooling, opts, reconfigure)
  };

  let configure: LibraryConfigure = {
    ...deps.universal.configure,
    ...deps.tooling.configure,
    pika(context: Riseup.Context) {
      return configurePika(opts.build, {
        babel: deps.tooling.configure.babel(context),
        typescript: deps.tooling.configure.typescript(context)
      });
    },
    typedoc(context: Riseup.Context) {
      return configureTypedoc(context.cwd, opts.docs);
    }
  };

  if (fetcher) fetcher(configure);
  configure = withReconfigure(configure, reconfigure);

  return {
    ...deps.universal.tasks,
    ...deps.tooling.tasks,
    build: create(({ cwd }) => {
      return build(opts.build, {
        pika: configure.pika({ cwd, task: 'build' }),
        babel: reconfigureBabelEnv(
          {
            spec: true,
            modules: false,
            targets: { esmodules: true }
          },
          configure.babel({ cwd, task: 'build' })
        )
      });
    }),
    docs: create(({ cwd }) => {
      return docs(opts.docs, {
        typedoc: configure.typedoc({ cwd, task: 'docs' })
      });
    }),
    distribute: create(() => distribute(opts.distribute))
  };
}
