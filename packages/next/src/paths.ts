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
    next: path.join(__dirname, '../')
  },
  babel: {
    presetNext: require.resolve('next/babel')
  },
  eslint: {
    configReactApp: require.resolve('eslint-config-react-app')
  }
};
