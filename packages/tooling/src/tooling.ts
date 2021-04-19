import { Empty, Serial } from 'type-core';
import { create } from 'kpo';
import up from 'find-up';
import { handleReconfigure } from '@riseup/utils';
import { node, lint, test, fix } from './tasks';
import {
  configureBabel,
  configureEslint,
  configureJest,
  configureTypescript,
  reconfigureBabel
} from './configure';
import {
  ToolingOptions,
  ToolingReconfigure,
  ToolingTasks
} from './definitions';

export function hydrateTooling(
  options: ToolingOptions | Empty
): Required<ToolingOptions> {
  return options
    ? {
        global: { ...options.global },
        fix: { ...options.global, ...options.fix },
        lint: { ...options.global, ...options.lint },
        test: { ...options.global, ...options.test }
      }
    : { global: {}, fix: {}, lint: {}, test: {} };
}

export function tooling(
  options: ToolingOptions | Empty,
  reconfigure?: ToolingReconfigure
): ToolingTasks {
  const opts = hydrateTooling(options);

  const configure = {
    prettier(cwd: string) {
      const file = up.sync('.prettierrc', { cwd, type: 'file' });
      return file ? require(file) : null;
    },
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
    eslint(cwd: string, highlight: boolean) {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.eslint,
        () => {
          return configureEslint(
            highlight ? opts.lint : { ...opts.lint, highlight: [] },
            {
              babel: configure.babel(),
              prettier: configure.prettier(cwd)
            }
          );
        }
      );
    },
    jest() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.jest,
        () => {
          return configureJest(opts.test, {
            babel: reconfigureBabel(
              {
                env: {
                  targets: { node: process.version.slice(1) }
                }
              },
              configure.babel()
            )
          });
        }
      );
    }
  };

  return {
    node: create(() => {
      return node(opts.global, {
        babel: reconfigureBabel(
          {
            env: {
              targets: { node: process.version.slice(1) }
            }
          },
          configure.babel()
        )
      });
    }),
    fix: create((ctx) => {
      return fix(opts.fix, { eslint: configure.eslint(ctx.cwd, false) });
    }),
    lint: create((ctx) => {
      return lint(opts.lint, { eslint: configure.eslint(ctx.cwd, true) });
    }),
    test: create(() => {
      return test({ jest: configure.jest() });
    })
  };
}
