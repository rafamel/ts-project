import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    craco: getBin('@craco/craco', 'craco', __dirname),
    sizeLimit: getBin('size-limit', 'size-limit', __dirname),
    sourceMapExplorer: getBin(
      'source-map-explorer',
      'source-map-explorer',
      __dirname
    )
  },
  riseup: {
    react: path.join(__dirname, '../'),
    tooling: path.dirname(require.resolve('@riseup/tooling/package.json'))
  },
  craco: {
    config: require.resolve('./tasks/helpers/craco-config')
  },
  babel: {
    presetReactApp: require.resolve('babel-preset-react-app'),
    mapperImage: require.resolve('./configure/babel/mapper-image'),
    mapperStyle: require.resolve('./configure/babel/mapper-style')
  },
  eslint: {
    configReactApp: require.resolve('eslint-config-react-app')
  },
  ava: {
    globalJsdomRegister: require.resolve('global-jsdom/register')
  }
};
