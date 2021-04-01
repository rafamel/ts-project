const os = require('os');
const path = require('path');

module.exports = {
  riseup: {
    tmp: path.join(os.tmpdir(), 'riseup'),
    intercept: require.resolve('./helpers/intercept')
  },
  babel: {
    presetEnv: require.resolve('@babel/preset-env'),
    presetTypeScript: require.resolve('@babel/preset-typescript'),
    pluginModuleResolver: require.resolve('babel-plugin-module-resolver')
  },
  eslint: {
    configStandard: require.resolve('eslint-config-standard'),
    configImportErrors: require.resolve('eslint-plugin-import/config/errors'),
    configPrettier: require.resolve('eslint-config-prettier'),
    parserBabel: require.resolve('babel-eslint'),
    parserTypeScript: require.resolve('@typescript-eslint/parser')
  },
  jest: {
    transformBabel: require.resolve('babel-jest')
  },
  pika: {
    pack: require.resolve('@pika/pack/dist-node/index.bin'),
    builderNode: require.resolve('./tasks/build/builder-node'),
    builderTypescript: require.resolve('./tasks/build/builder-typescript')
  },
  typescript: {
    ttsc: require.resolve('ttypescript/lib/tsc')
  }
};
