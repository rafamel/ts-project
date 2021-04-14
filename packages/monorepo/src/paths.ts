import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    lerna: getBin('lerna', 'lerna')
  },
  execute: {
    each: require.resolve('./tasks/execute/each')
  }
};
