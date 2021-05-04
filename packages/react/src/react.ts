import { Empty } from 'type-core';
import { create } from 'kpo';
import { extract, withReconfigure, Riseup } from '@riseup/utils';
import { hydrateUniversal, universal } from '@riseup/universal';
import { hydrateTooling, tooling } from '@riseup/tooling';
import { start, build, analyze, size } from './tasks';
import { hydrateReactGlobal } from './global';
import {
  ReactConfigure,
  ReactOptions,
  ReactReconfigure,
  ReactTasks
} from './definitions';
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
  reconfigure: ReactReconfigure | Empty,
  fetcher: Riseup.Fetcher<ReactConfigure> | Empty
): ReactTasks {
  const opts = hydrateReact(options);

  const deps = {
    universal: extract(universal, opts, reconfigure),
    tooling: extract(tooling, opts, {
      ...reconfigure,
      babel: (config) => reconfigureBabelReact(config),
      eslint: (config) => reconfigureEslintReact(config),
      ava: (config) => reconfigureAvaReact(config)
    })
  };

  let configure: ReactConfigure = {
    ...deps.universal.configure,
    ...deps.tooling.configure,
    babel(context: Riseup.Context) {
      return reconfigureBabelReact(deps.tooling.configure.babel(context));
    },
    eslint(context: Riseup.Context) {
      return reconfigureEslintReact(deps.tooling.configure.eslint(context));
    },
    ava(context: Riseup.Context) {
      return reconfigureAvaReact(deps.tooling.configure.ava(context));
    }
  };

  if (fetcher) fetcher(configure);
  configure = withReconfigure(configure, reconfigure);

  return {
    ...deps.universal.tasks,
    ...deps.tooling.tasks,
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
    size: create(() => size(opts.size)),
    analyze: create(() => analyze())
  };
}
