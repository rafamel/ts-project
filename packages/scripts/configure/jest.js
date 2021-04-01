const fs = require('fs');
const paths = require('../paths');
const tmpPath = require('../helpers/tmp-path');

module.exports = function jest(data) {
  const extensions = [
    ...data.options.extensions.js,
    ...data.options.extensions.ts
  ];
  const hashPath = tmpPath(data.config.babel.node);
  const transformPath = hashPath + '-transform.js';
  const babelPath = hashPath + '-babel.json';

  fs.writeFileSync(
    transformPath,
    `const bj = require('${paths.jest.transformBabel}');
     module.exports = bj.createTransformer({
       configFile: '${babelPath}'
     });`
  );
  fs.writeFileSync(babelPath, JSON.stringify(data.config.babel.node));

  return {
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [`<rootDir>/src/**/*.{${extensions.join(',')}}`],
    modulePathIgnorePatterns: [
      '.*\\.d\\.ts$',
      '<rootDir>/pkg',
      '<rootDir>/dist',
      '<rootDir>/src/@types',
      '<rootDir>/src/.*/__mocks__'
    ],
    moduleFileExtensions: ['json']
      .concat(data.options.extensions.js)
      .concat(data.options.extensions.ts),
    testPathIgnorePatterns: [
      '/node_modules/',
      `/(test|spec)\\.(${extensions.join('|')})$`
    ],
    transform: {
      [`^.+\\.(${extensions.join('|')})$`]: transformPath
    }
  };
};
