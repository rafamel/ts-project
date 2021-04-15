import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    babelCli: getBin('@babel/cli', 'babel', __dirname),
    babelNode: getBin('@babel/node', 'babel-node', __dirname),
    eslint: getBin('eslint', 'eslint', __dirname),
    jest: getBin('jest-cli', 'jest', __dirname),
    typescript: require.resolve('ttypescript/lib/tsc')
  },
  riseup: {
    tooling: path.resolve(__dirname, '../')
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
  },
  jest: {
    transformBabel: require.resolve('babel-jest')
  }
};
