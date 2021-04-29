import { Empty } from 'type-core';
import { create } from 'kpo';
import up from 'find-up';
import { handleReconfigure, Riseup } from '@riseup/utils';
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
    prettier(context: Riseup.Context) {
      const file = up.sync('.prettierrc', {
        cwd: context.cwd,
        type: 'file'
      });
      return file ? require(file) : null;
    },
    babel(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'babel', () => {
        return reconfigureBabelEnv(
          { targets: { node: process.version.slice(1) } },
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
    eslint(context: Riseup.Context, highlight: boolean) {
      return handleReconfigure(context, { ...reconfigure }, 'eslint', () => {
        return configureEslint(
          context.cwd,
          highlight ? opts.lint : { ...opts.lint, highlight: [] },
          {
            babel: configure.babel(context),
            typescript: configure.typescript(context),
            prettier: configure.prettier(context)
          }
        );
      });
    },
    ava(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'ava', () => {
        return configureAva(opts.test, {
          babel: configure.babel(context)
        });
      });
    },
    nyc(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'nyc', () => {
        return configureNyc(opts.coverage, {
          babel: configure.babel(context)
        });
      });
    }
  };

  return {
    node: create(({ cwd }) => {
      return node(opts.global, {
        babel: configure.babel({ cwd, task: 'node' })
      });
    }),
    fix: create(({ cwd }) => {
      return fix(opts.fix, {
        eslint: configure.eslint({ cwd, task: 'fix' }, false)
      });
    }),
    lint: create(({ cwd }) => {
      return lint(opts.lint, {
        eslint: configure.eslint({ cwd, task: 'lint' }, true),
        typescript: configure.typescript({ cwd, task: 'lint' })
      });
    }),
    test: create(({ cwd }) => {
      return test({ ava: configure.ava({ cwd, task: 'test' }) });
    }),
    coverage: create(({ cwd }) => {
      return coverage({
        ava: configure.ava({ cwd, task: 'coverage' }),
        nyc: configure.nyc({ cwd, task: 'coverage' })
      });
    })
  };
}
