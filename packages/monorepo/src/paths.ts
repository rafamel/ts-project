import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    lerna: getBin('lerna', 'lerna'),
    lcovResultMerger: getBin('lcov-result-merger', 'lcov-result-merger'),
    run: require.resolve('./tasks/bin/run'),
    execute: require.resolve('./tasks/bin/execute')
  }
};
