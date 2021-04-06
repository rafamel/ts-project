import { Empty, Serial } from 'type-core';
import { deep, merge } from 'merge-strategies';
import { tmpPath } from '@riseup/utils';
import { defaults } from '../defaults';
import { paths } from '../paths';
import fs from 'fs';

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

export function configureJest(
  options: ConfigureJestOptions | Empty,
  config: ConfigureJestConfig
): Serial.Object {
  const opts = merge(
    {
      overrides: defaults.test.overrides,
      extensions: defaults.global.extensions
    },
    options || undefined
  );

  const extensions = [...opts.extensions.js, ...opts.extensions.ts];
  const hashPath = tmpPath(config.babel);
  const transformPath = hashPath + '-transform.js';
  const babelPath = hashPath + '-babel.json';

  fs.writeFileSync(
    transformPath,
    `const bj = require('${paths.jest.transformBabel}');
     module.exports = bj.createTransformer({
       configFile: '${babelPath}'
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
