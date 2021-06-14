import { Deep, Empty, Serial } from 'type-core';
import { deep, merge } from 'merge-strategies';
import fs from 'fs';
import { tmpPath } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ConfigureJestParams {
  verbose?: boolean;
  ignore?: string[];
  require?: string[];
  coverage?: 'auto' | 'all' | 'none';
  threshold?: number | null;
  overrides?: Serial.Object;
}

export interface ConfigureJestOptions extends ConfigureJestParams {
  extensions?: {
    js?: string[];
    ts?: string[];
  };
}

export interface ConfigureJestConfig {
  babel: Serial.Object;
}

export function hydrateConfigureJest(
  options: ConfigureJestOptions | Empty
): Deep.Required<ConfigureJestOptions> {
  return merge(
    {
      ...hydrateToolingGlobal(options),
      verbose: defaults.test.verbose,
      ignore: defaults.test.ignore,
      require: defaults.test.require,
      coverage: defaults.test.coverage,
      threshold: defaults.test.threshold,
      overrides: defaults.test.overrides
    },
    options || undefined
  );
}

export function configureJest(
  options: ConfigureJestOptions | Empty,
  config: ConfigureJestConfig
): Serial.Object {
  const opts = hydrateConfigureJest(options);

  const extensions = [...opts.extensions.js, ...opts.extensions.ts];
  const hashPath = tmpPath(null, config.babel);
  const babelPath = hashPath + '-babel.json';
  const transformPath = hashPath + '-transform.js';

  fs.writeFileSync(babelPath, JSON.stringify(config.babel));
  fs.writeFileSync(
    transformPath,
    `const bj = require(${JSON.stringify(paths.jest.transformBabel)});
     const babelJest = bj.__esModule ? bj.default : bj;
     module.exports = babelJest.createTransformer({
       configFile: ${JSON.stringify(babelPath)}
     });`
  );

  return deep(
    {
      injectGlobals: false,
      testEnvironment: 'node',
      moduleFileExtensions: ['json']
        .concat(opts.extensions.js)
        .concat(opts.extensions.ts),
      modulePathIgnorePatterns: [
        '.*\\.d\\.ts$',
        '/__mocks__/',
        '/@types/',
        ...opts.ignore
      ],
      setupFiles: [...opts.require],
      transform: {
        [`^.+\\.(${extensions.join('|')})$`]: transformPath
      },
      transformIgnorePatterns: [],
      testMatch: [
        `**/__tests__/**/*.{${extensions.join(',')}}`,
        `**/?(*.)+(spec|test).{${extensions.join(',')}}`
      ],
      testPathIgnorePatterns: [
        `.*/(test|spec)\\.(${extensions.join('|')})$`,
        '/node_modules/',
        ...opts.ignore
      ],
      // Coverage
      ...(opts.coverage === 'none'
        ? { collectCoverage: false }
        : {
            collectCoverage: true,
            coveragePathIgnorePatterns: [
              '.*\\.d\\.ts$',
              '/node_modules/',
              '/__mocks__/',
              '/@types/',
              '/vendor/',
              ...opts.ignore
            ]
          }),
      ...(opts.coverage === 'all'
        ? {
            collectCoverageFrom: [
              `<rootDir>/src/**/*.{${extensions.join(',')}}`,
              '!**/node_modules/**',
              '!**/__mocks__/**',
              '!**/@types/**',
              '!**/vendor/**'
            ]
          }
        : {}),
      ...(opts.coverage !== 'none' && opts.threshold
        ? {
            coverageThreshold: {
              global: {
                lines: opts.threshold,
                branches: opts.threshold,
                functions: opts.threshold,
                statements: opts.threshold
              }
            }
          }
        : {})
    },
    opts.overrides || undefined
  );
}
