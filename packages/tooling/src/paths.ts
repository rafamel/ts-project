import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    babelCli: getBin('@babel/cli', 'babel'),
    babelNode: getBin('@babel/node', 'babel-node'),
    typescript: require.resolve('ttypescript/lib/tsc')
  },
  babel: {
    presetEnv: require.resolve('@babel/preset-env'),
    presetTypeScript: require.resolve('@babel/preset-typescript'),
    pluginModuleResolver: require.resolve('babel-plugin-module-resolver')
  },
  typescript: {
    config: require.resolve('../static/tsconfig.json')
  },
  eslint: {
    configStandard: require.resolve('eslint-config-standard'),
    configImportErrors: require.resolve('eslint-plugin-import/config/errors'),
    configPrettier: require.resolve('eslint-config-prettier'),
    parserBabel: require.resolve('@babel/eslint-parser'),
    parserTypeScript: require.resolve('@typescript-eslint/parser')
  }
};
