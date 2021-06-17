import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    next: getBin('next', 'next', __dirname),
    nextEntry: require.resolve('./tasks/helpers/next-entry'),
    sizeLimit: getBin('size-limit', 'size-limit', __dirname),
    sourceMapExplorer: getBin(
      'source-map-explorer',
      'source-map-explorer',
      __dirname
    )
  },
  riseup: {
    pkgNext: path.join(__dirname, '../'),
    logoNext: path.join(__dirname, '../static/react.svg')
  },
  babel: {
    presetNext: require.resolve('next/babel')
  }
};
