import { Empty } from 'type-core';
import { create } from 'kpo';
import up from 'find-up';
import { handleReconfigure, Riseup } from '@riseup/utils';
import { hydrateUniversal, universal } from '@riseup/universal';
import {
  configureBabel,
  configureEslint,
  configureTypescript,
  hydrateTooling,
  tooling
} from '@riseup/tooling';
import { start, build, analyze, size } from './tasks';
import { hydrateReactGlobal } from './global';
import { ReactOptions, ReactReconfigure, ReactTasks } from './definitions';
import {
  reconfigureAvaReact,
  reconfigureBabelReact,
  reconfigureEslintReact
} from './configure';

export function hydrateReact(
  options: ReactOptions | Empty
): Required<ReactOptions> {
  const global = hydrateReactGlobal(options ? options.global : null);
  const universal = hydrateUniversal(options);
  const tooling = hydrateTooling(options);
  const react = options
    ? {
        start: { ...options.global, ...options.start },
        size: { ...options.size }
      }
    : { start: {}, size: {} };

  return {
    ...universal,
    ...tooling,
    ...react,
    global
  };
}

export function react(
  options: ReactOptions | Empty,
  reconfigure?: ReactReconfigure
): ReactTasks {
  const opts = hydrateReact(options);

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
        return reconfigureBabelReact(configureBabel(opts.global));
      });
    },
    typescript(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'babel', () => {
        return configureTypescript(context.cwd);
      });
    },
    eslint(context: Riseup.Context) {
      return handleReconfigure(context, { ...reconfigure }, 'eslint', () => {
        return reconfigureEslintReact(
          configureEslint(
            context.cwd,
            { ...opts.global, ...opts.lint },
            {
              babel: configure.babel(context),
              typescript: configure.typescript(context),
              prettier: configure.prettier(context)
            }
          )
        );
      });
    }
  };

  return {
    ...universal(opts, reconfigure),
    ...tooling(opts, {
      ...reconfigure,
      babel(config, context) {
        return handleReconfigure(context, { ...reconfigure }, 'babel', () => {
          return reconfigureBabelReact(config);
        });
      },
      eslint(config, context) {
        return handleReconfigure(context, { ...reconfigure }, 'eslint', () => {
          return reconfigureEslintReact(config);
        });
      },
      ava(config, context) {
        return handleReconfigure(context, { ...reconfigure }, 'ava', () => {
          return reconfigureAvaReact(config);
        });
      }
    }),
    start: create(({ cwd }) => {
      return start(opts.start, {
        babel: configure.babel({ cwd, task: 'start' }),
        typescript: configure.typescript({ cwd, task: 'start' }),
        eslint: configure.eslint({ cwd, task: 'start' })
      });
    }),
    build: create(({ cwd }) => {
      return build(opts.global, {
        babel: configure.babel({ cwd, task: 'build' }),
        typescript: configure.typescript({ cwd, task: 'build' }),
        eslint: configure.eslint({ cwd, task: 'build' })
      });
    }),
    size: create(() => {
      return size(opts.size);
    }),
    analyze: create(() => {
      return analyze();
    })
  };
}
