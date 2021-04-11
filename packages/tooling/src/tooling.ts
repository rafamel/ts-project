import { Empty, Serial } from 'type-core';
import { create } from 'kpo';
import up from 'find-up';
import { handleReconfigure } from '@riseup/utils';
import { lint, test, node, transpile } from './tasks';
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
        transpile: { ...options.global, ...options.transpile },
        lint: { ...options.global, ...options.lint },
        test: { ...options.global, ...options.test }
      }
    : { global: {}, transpile: {}, lint: {}, test: {} };
}

export function tooling(
  options: ToolingOptions | Empty,
  reconfigure?: ToolingReconfigure
): ToolingTasks {
  const opts = hydrateTooling(options);

  const configure = {
    prettier(cwd: string) {
      const file = up.sync('.prettierrc', { cwd, type: 'file' });
      return file ? require(file) : {};
    },
    babel() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.babel,
        () => configureBabel(opts.transpile)
      );
    },
    typescript(cwd: string) {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.typescript,
        () => configureTypescript(cwd)
      );
    },
    eslint(cwd: string) {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.eslint,
        () => {
          return configureEslint(opts.lint, {
            babel: configure.babel(),
            prettier: configure.prettier(cwd)
          });
        }
      );
    },
    jest() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.jest,
        () => {
          return configureJest(opts.test, {
            babel: reconfigureBabel(
              { targets: { node: process.version.slice(1) } },
              configure.babel()
            )
          });
        }
      );
    }
  };

  return {
    transpile: create((ctx) => {
      return transpile(opts.transpile, {
        babel: configure.babel(),
        typescript: configure.typescript(ctx.cwd)
      });
    }),
    node: create(() => {
      return node(opts.global, {
        babel: reconfigureBabel(
          { targets: { node: process.version.slice(1) } },
          configure.babel()
        )
      });
    }),
    lint: create((ctx) => {
      return lint(opts.lint, { eslint: configure.eslint(ctx.cwd) });
    }),
    test: create(() => {
      return test({ jest: configure.jest() });
    })
  };
}
