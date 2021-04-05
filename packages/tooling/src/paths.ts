import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    babelCli: getBin('@babel/cli', 'babel'),
    typescript: require.resolve('ttypescript/lib/tsc')
  },
  babel: {
    presetEnv: require.resolve('@babel/preset-env'),
    presetTypeScript: require.resolve('@babel/preset-typescript'),
    pluginModuleResolver: require.resolve('babel-plugin-module-resolver')
  },
  typescript: {
    config: require.resolve('../static/tsconfig.json')
  }
};
