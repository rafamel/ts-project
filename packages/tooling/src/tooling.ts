import { Empty, Serial } from 'type-core';
import { create } from 'kpo';
import up from 'find-up';
import { handleReconfigure } from '@riseup/utils';
import { node, lint, test, fix, coverage } from './tasks';
import {
  configureAva,
  configureBabel,
  configureEslint,
  configureNyc,
  configureTypescript,
  reconfigureBabelEnv
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
        test: { ...options.global, ...options.test },
        coverage: { ...options.global, ...options.coverage }
      }
    : { global: {}, fix: {}, lint: {}, test: {}, coverage: {} };
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
            cwd,
            highlight ? opts.lint : { ...opts.lint, highlight: [] },
            {
              babel: configure.babel(),
              typescript: configure.typescript(cwd),
              prettier: configure.prettier(cwd)
            }
          );
        }
      );
    },
    ava() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.ava,
        () => {
          return configureAva(opts.test, {
            babel: reconfigureBabelEnv(
              { targets: { node: process.version.slice(1) } },
              configure.babel()
            )
          });
        }
      );
    },
    nyc() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.nyc,
        () => {
          return configureNyc(opts.coverage, {
            babel: reconfigureBabelEnv(
              { targets: { node: process.version.slice(1) } },
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
        babel: reconfigureBabelEnv(
          { targets: { node: process.version.slice(1) } },
          configure.babel()
        )
      });
    }),
    fix: create((ctx) => {
      return fix(opts.fix, { eslint: configure.eslint(ctx.cwd, false) });
    }),
    lint: create((ctx) => {
      return lint(opts.lint, {
        eslint: configure.eslint(ctx.cwd, true),
        typescript: configure.typescript(ctx.cwd)
      });
    }),
    test: create(() => {
      return test({ ava: configure.ava() });
    }),
    coverage: create(() => {
      return coverage({ ava: configure.ava(), nyc: configure.nyc() });
    })
  };
}
