import path from 'path';
import { IOfType, IOptionsReact } from '~/types';
import { DeepRequired } from 'utility-types';
import assert from 'assert';

const TRANFORM_KEY = '^.+\\.(js|jsx|ts|tsx)$';
export default function getJest({
  paths
}: DeepRequired<IOptionsReact>): IOfType<any> {
  const testScriptPath = require.resolve('react-scripts/scripts/test');
  const config = require('react-scripts/scripts/utils/createJestConfig')(
    (relative: string) => {
      return path.resolve(path.dirname(testScriptPath), '..', relative);
    },
    paths.root,
    false
  );

  assert(config.transform[TRANFORM_KEY]);
  delete config.transform[TRANFORM_KEY];

  return {
    ...config,
    collectCoverage: true,
    collectCoverageFrom: [`<rootDir>/src/**/*`],
    testMatch: [
      ...(config.testMatch || []),
      ...(config.testMatch || []).map((glob: string) =>
        glob.replace('/src/', '/test/')
      )
    ].filter((x, i, arr) => arr.indexOf(x) === i),
    modulePaths: [`<rootDir>/src`, `<rootDir>/test`],
    transform: {
      ...config.transform,
      [TRANFORM_KEY]: require.resolve(
        '@riseup/tooling/dist/presets/jest/transform'
      )
    },
    transformIgnorePatterns: ['^.+\\.module\\.(css|sass|scss)$']
  };
}