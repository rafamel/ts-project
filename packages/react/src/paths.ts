import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    craco: getBin('@craco/craco', 'craco', __dirname)
  },
  riseup: {
    tooling: path.dirname(require.resolve('@riseup/tooling/package.json'))
  },
  craco: {
    config: require.resolve('./tasks/helpers/craco-config')
  },
  babel: {
    presetReactApp: require.resolve('babel-preset-react-app')
  },
  eslint: {
    configReactApp: require.resolve('eslint-config-react-app')
  }
};
