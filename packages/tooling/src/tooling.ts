import { Empty, Members, Serial, UnaryFn } from 'type-core';
import { shallow } from 'merge-strategies';
import { context, Task } from 'kpo';
import { into } from 'pipettes';
import up from 'find-up';
import { getConfiguration } from '@riseup/utils';
import { defaults } from './defaults';
import {
  lint,
  test,
  node,
  transpile,
  LintParams,
  TranspileParams
} from './tasks';
import {
  configureBabel,
  ConfigureBabelParams,
  configureEslint,
  ConfigureEslintParams,
  configureJest,
  ConfigureJestParams,
  configureTypescript,
  reconfigureBabel
} from './configure';

export interface GlobalToolingOptions {
  root?: string;
  alias?: Members<string>;
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface ToolingOptions {
  global?: GlobalToolingOptions;
  transpile?: TranspileParams & ConfigureBabelParams;
  lint?: LintParams & ConfigureEslintParams;
  test?: ConfigureJestParams;
}

export interface ToolingReconfigure {
  babel?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  typescript?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  eslint?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
  jest?: Serial.Object | UnaryFn<Serial.Object, Serial.Object>;
}

export interface ToolingTasks {
  transpile: Task;
  node: Task;
  lint: Task;
  test: Task;
}

export function tooling(
  options: ToolingOptions | Empty,
  reconfigure: ToolingReconfigure = {}
): ToolingTasks {
  const opts: ToolingOptions = shallow(
    {
      global: {},
      transpile: {},
      lint: {},
      test: {}
    },
    options || undefined
  );

  const cwd = (opts.global && opts.global.root) || defaults.global.root;
  const wrap = context.bind(null, { cwd });
  return into(
    {
      prettier: into(
        null,
        () => up.sync('.prettierrc', { cwd, type: 'file' }),
        (file) => (file ? require(file) : {})
      ),
      babel: getConfiguration<Serial.Object>(reconfigure.babel, () => {
        return configureBabel({ ...opts.global, ...opts.transpile });
      })
    },
    (config) => ({
      ...config,
      typescript: getConfiguration<Serial.Object>(
        reconfigure.typescript,
        () => {
          return configureTypescript({ ...opts.global });
        }
      ),
      eslint: getConfiguration<Serial.Object>(reconfigure.eslint, () => {
        return configureEslint(
          { ...opts.global, ...opts.lint },
          { babel: config.babel, prettier: config.prettier }
        );
      }),
      jest: getConfiguration<Serial.Object>(reconfigure.jest, () => {
        return configureJest(
          { ...opts.global, ...opts.test },
          {
            babel: reconfigureBabel(
              { targets: { node: process.version.slice(1) } },
              config.babel
            )
          }
        );
      })
    }),
    (config) => ({
      transpile: wrap(
        transpile(
          { ...opts.global, ...opts.transpile },
          { babel: config.babel, typescript: config.typescript }
        )
      ),
      node: wrap(
        node(
          { ...opts.global },
          {
            babel: reconfigureBabel(
              { targets: { node: process.version.slice(1) } },
              config.babel
            )
          }
        )
      ),
      lint: wrap(
        lint({ ...opts.global, ...opts.lint }, { eslint: config.eslint })
      ),
      test: wrap(test({ jest: config.jest }))
    })
  );
}
