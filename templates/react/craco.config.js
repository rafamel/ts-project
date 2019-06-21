const assert = require('assert');
const babel = require('./.babelrc');
const eslint = require('./.eslintrc');
const define = require('./setup/define');

const Interpolate = require('react-dev-utils/InterpolateHtmlPlugin');
const HtmlWebpack = require('html-webpack-plugin');
module.exports = {
  devServer: {
    open: false,
    port: Number(process.env.PORT) > 0 ? Number(process.env.PORT) : 3000
  },
  babel: {
    presets: babel.presets.slice(1),
    plugins: babel.plugins
  },
  eslint: {
    enable: true,
    mode: 'file',
    configure: eslint,
    loaderOptions: (options) => ({ ...options, emitWarning: true })
  },
  webpack: {
    plugins: new Interpolate(HtmlWebpack, define)
  },
  jest: {
    configure(options) {
      assert(options.transform['^.+\\.(js|jsx|ts|tsx)$']);

      return {
        ...options,
        collectCoverage: true,
        collectCoverageFrom: [`<rootDir>/src/**/*`],
        setupFilesAfterEnv: ['<rootDir>/setup/jest/environment.js'].concat(
          options.setupFilesAfterEnv || []
        ),
        testMatch: options.testMatch.concat(
          options.testMatch.map((glob) => glob.replace('/src/', '/test/'))
        ),
        modulePaths: [`<rootDir>/src`, `<rootDir>/test`],
        transform: {
          ...options.transform,
          '^.+\\.(js|jsx|ts|tsx)$': require.resolve('./setup/jest/transform')
        },
        transformIgnorePatterns: [
          '/node_modules/(?!(module-to-transpile)/)',
          '^.+\\.module\\.(css|sass|scss)$'
        ]
      };
    }
  }
};
