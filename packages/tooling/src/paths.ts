import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    jest: getBin('jest-cli', 'jest', __dirname),
    eslint: getBin('eslint', 'eslint', __dirname),
    prettier: getBin('prettier', 'prettier', __dirname),
    babelNode: getBin('@babel/node', 'babel-node', __dirname),
    typescript: require.resolve('ttypescript/lib/tsc')
  },
  riseup: {
    tooling: path.resolve(__dirname, '../')
  },
  babel: {
    presetEnv: require.resolve('@babel/preset-env'),
    presetTypeScript: require.resolve('@babel/preset-typescript'),
    pluginModuleResolver: require.resolve('babel-plugin-module-resolver'),
    pluginModuleNameMapper: require.resolve('babel-plugin-module-name-mapper'),
    mapperIdentity: require.resolve('./configure/babel/mapper-identity'),
    mapperRoute: require.resolve('./configure/babel/mapper-route'),
    mapperImage: require.resolve('./configure/babel/mapper-image')
  },
  typescript: {
    config: require.resolve('../static/tsconfig.json'),
    transformPaths: require.resolve('@zerollup/ts-transform-paths')
  },
  eslint: {
    configStandard: require.resolve('eslint-config-standard'),
    parserBabel: require.resolve('@babel/eslint-parser'),
    parserTypescript: require.resolve('@typescript-eslint/parser')
  },
  jest: {
    transformBabel: require.resolve('babel-jest')
  }
};
