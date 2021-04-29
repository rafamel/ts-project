import { Empty } from 'type-core';
import { create } from 'kpo';
import { handleReconfigure, Riseup } from '@riseup/utils';
import { hydrateUniversal, universal } from '@riseup/universal';
import {
  configureBabel,
  hydrateTooling,
  tooling,
  configureTypescript,
  reconfigureBabelEnv
} from '@riseup/tooling';
import { build, distribute, docs } from './tasks';
import { configurePika, configureTypedoc } from './configure';
import {
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
  reconfigure?: LibraryReconfigure
): LibraryTasks {
  const opts = hydrateLibrary(options);

  const configure = {
    babel(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'babel', () => {
        return reconfigureBabelEnv(
          {
            spec: true,
            modules: false,
            targets: { esmodules: true }
          },
          configureBabel(opts.global)
        );
      });
    },
    typescript(context: Riseup.Context) {
      return handleReconfigure(
        context,
        { ...reconfigure },
        'typescript',
        () => {
          return configureTypescript(context.cwd);
        }
      );
    },
    pika(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'pika', () => {
        return configurePika(opts.build, {
          babel: configure.babel(context),
          typescript: configure.typescript(context)
        });
      });
    },
    typedoc(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'typedoc', () => {
        return configureTypedoc(context.cwd, opts.docs);
      });
    }
  };

  return {
    ...universal(opts, reconfigure),
    ...tooling(opts, reconfigure),
    build: create(({ cwd }) => {
      return build(opts.build, {
        pika: configure.pika({ cwd, task: 'build' }),
        babel: configure.babel({ cwd, task: 'build' })
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
