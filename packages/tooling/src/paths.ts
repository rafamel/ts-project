import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    ava: getBin('ava', 'ava', __dirname),
    nyc: getBin('nyc', 'nyc', __dirname),
    eslint: getBin('eslint', 'eslint', __dirname),
    prettier: getBin('prettier', 'prettier', __dirname),
    babelNode: getBin('@babel/node', 'babel-node', __dirname),
    typescript: require.resolve('ttypescript/lib/tsc')
  },
  riseup: {
    tooling: path.resolve(__dirname, '../')
  },
  babel: {
    register: require.resolve('@babel/register'),
    presetEnv: require.resolve('@babel/preset-env'),
    presetTypeScript: require.resolve('@babel/preset-typescript'),
    pluginModuleResolver: require.resolve('babel-plugin-module-resolver'),
    pluginModuleNameMapper: require.resolve('babel-plugin-module-name-mapper'),
    mapperAsset: require.resolve('./configure/babel/mapper-asset'),
    mapperStyle: require.resolve('./configure/babel/mapper-style')
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
