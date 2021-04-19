import { Empty, Serial } from 'type-core';
import { create } from 'kpo';
import { handleReconfigure } from '@riseup/utils';
import { hydrateUniversal, universal } from '@riseup/universal';
import {
  configureBabel,
  hydrateTooling,
  tooling,
  configureTypescript
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
    babel() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.babel,
        () => configureBabel(opts.global)
      );
    },
    typescript(cwd: string) {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.typescript,
        () => configureTypescript(cwd)
      );
    },
    pika(cwd: string) {
      return handleReconfigure<Serial.Array>(
        reconfigure && reconfigure.pika,
        () => {
          return configurePika(opts.build, {
            babel: configure.babel(),
            typescript: configure.typescript(cwd)
          });
        }
      );
    },
    typedoc(cwd: string) {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.typedoc,
        () => configureTypedoc(cwd, opts.docs)
      );
    }
  };

  return {
    ...universal(opts, reconfigure),
    ...tooling(opts, reconfigure),
    build: create((ctx) => {
      return build(opts.build, {
        pika: configure.pika(ctx.cwd),
        babel: configure.babel()
      });
    }),
    docs: create((ctx) => {
      return docs(opts.docs, { typedoc: configure.typedoc(ctx.cwd) });
    }),
    distribute: create(() => distribute(opts.distribute))
  };
}
