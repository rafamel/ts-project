import { Empty, Serial } from 'type-core';
import { create } from 'kpo';
import up from 'find-up';
import { handleReconfigure } from '@riseup/utils';
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
    prettier(cwd: string) {
      const file = up.sync('.prettierrc', { cwd, type: 'file' });
      return file ? require(file) : null;
    },
    babel() {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.babel,
        () => reconfigureBabelReact(configureBabel(opts.global))
      );
    },
    typescript(cwd: string) {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.babel,
        () => configureTypescript(cwd)
      );
    },
    eslint(cwd: string) {
      return handleReconfigure<Serial.Object>(
        reconfigure && reconfigure.eslint,
        () => {
          return reconfigureEslintReact(
            configureEslint(
              cwd,
              { ...opts.global, ...opts.lint },
              {
                babel: configure.babel(),
                typescript: configure.typescript(cwd),
                prettier: configure.prettier(cwd)
              }
            )
          );
        }
      );
    }
  };

  return {
    ...universal(opts, reconfigure),
    ...tooling(opts, {
      ...reconfigure,
      babel(config) {
        return handleReconfigure(reconfigure && reconfigure.babel, () => {
          return reconfigureBabelReact(config);
        });
      },
      eslint(config) {
        return handleReconfigure(reconfigure && reconfigure.eslint, () => {
          return reconfigureEslintReact(config);
        });
      },
      ava(config) {
        return handleReconfigure(reconfigure && reconfigure.ava, () => {
          return reconfigureAvaReact(config);
        });
      }
    }),
    start: create((ctx) => {
      return start(opts.start, {
        babel: configure.babel(),
        typescript: configure.typescript(ctx.cwd),
        eslint: configure.eslint(ctx.cwd)
      });
    }),
    build: create((ctx) => {
      return build(opts.global, {
        babel: configure.babel(),
        typescript: configure.typescript(ctx.cwd),
        eslint: configure.eslint(ctx.cwd)
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
