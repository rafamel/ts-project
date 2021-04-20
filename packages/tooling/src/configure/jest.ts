import { Deep, Empty, Serial } from 'type-core';
import { deep, merge } from 'merge-strategies';
import fs from 'fs';
import { tmpPath } from '@riseup/utils';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ConfigureJestParams {
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
  const hashPath = tmpPath(config.babel);
  const transformPath = hashPath + '-transform.js';
  const babelPath = hashPath + '-babel.json';

  fs.writeFileSync(
    transformPath,
    `const bj = require(${JSON.stringify(paths.jest.transformBabel)});
     module.exports = bj.createTransformer({
       configFile: ${JSON.stringify(babelPath)}
     });`
  );
  fs.writeFileSync(babelPath, JSON.stringify(config.babel));

  return deep(
    {
      testEnvironment: 'node',
      collectCoverage: true,
      collectCoverageFrom: [`<rootDir>/src/**/*.{${extensions.join(',')}}`],
      modulePathIgnorePatterns: [
        '.*\\.d\\.ts$',
        '<rootDir>/pkg',
        '<rootDir>/dist',
        '<rootDir>/src/@types',
        '<rootDir>/src/.*/__mocks__'
      ],
      moduleFileExtensions: ['json']
        .concat(opts.extensions.js)
        .concat(opts.extensions.ts),
      testPathIgnorePatterns: [
        '/node_modules/',
        `/(test|spec)\\.(${extensions.join('|')})$`
      ],
      transform: {
        [`^.+\\.(${extensions.join('|')})$`]: transformPath
      }
    },
    opts.overrides || undefined
  );
}
