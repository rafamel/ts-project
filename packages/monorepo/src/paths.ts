import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    lerna: getBin('lerna', 'lerna', __dirname),
    lcovResultMerger: getBin(
      'lcov-result-merger',
      'lcov-result-merger',
      __dirname
    ),
    run: require.resolve('./tasks/bin/run'),
    execute: require.resolve('./tasks/bin/execute'),
    coverage: require.resolve('./tasks/bin/coverage')
  }
};
