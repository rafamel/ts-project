import { Empty, Serial } from 'type-core';
import { merge } from 'merge-strategies';
import { create } from 'kpo';
import path from 'path';
import { getConfiguration } from '@riseup/utils';
import {
  configureReleaseit,
  hydrateUniversal,
  universal,
  UniversalOptions
} from '@riseup/universal';
import {
  configureBabel,
  hydrateTooling,
  tooling,
  configureTypescript,
  hydrateTranspile
} from '@riseup/tooling';
import { build, docs, hydrateBuild } from './tasks';
import { configurePika, configureTypedoc } from './configure';
import {
  LibraryOptions,
  LibraryReconfigure,
  LibraryTasks
} from './definitions';

export function hydrateLibrary(
  options: LibraryOptions | Empty
): Required<LibraryOptions> {
  const universal = hydrateUniversal(options);
  const tooling = hydrateTooling(options);
  const library = options
    ? {
        build: { ...options.build },
        docs: { ...options.docs }
      }
    : { build: {}, docs: {} };

  return {
    ...merge<UniversalOptions, Required<UniversalOptions>>(
      {
        release: {
          publish: true,
          overrides: {
            npm: { publishPath: hydrateBuild(library.build).destination }
          }
        }
      },
      universal
    ),
    ...tooling,
    transpile: {
      ...tooling.transpile,
      output: path.join(
        hydrateBuild(library.build).destination,
        hydrateTranspile(tooling.transpile).output
      )
    },
    ...library
  };
}

export function library(
  options: LibraryOptions | Empty,
  reconfigure?: LibraryReconfigure
): LibraryTasks {
  const opts = hydrateLibrary(options);

  const configure = {
    babel() {
      return getConfiguration<Serial.Object>(
        reconfigure && reconfigure.babel,
        () => configureBabel(opts.transpile)
      );
    },
    typescript(cwd: string) {
      return getConfiguration<Serial.Object>(
        reconfigure && reconfigure.typescript,
        () => configureTypescript(cwd)
      );
    },
    releaseit() {
      return getConfiguration<Serial.Object>(
        reconfigure && reconfigure.releaseit,
        () => configureReleaseit(opts.release)
      );
    },
    pika(cwd: string) {
      return getConfiguration<Serial.Array>(
        reconfigure && reconfigure.pika,
        () => {
          return configurePika(
            { ...opts.transpile, ...opts.build },
            { babel: configure.babel(), typescript: configure.typescript(cwd) }
          );
        }
      );
    },
    typedoc(cwd: string) {
      return getConfiguration<Serial.Object>(
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
    })
  };
}
