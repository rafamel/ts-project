const { EXT_JS, EXT_TS } = require('./project.config');
const EXT = EXT_JS + ',' + EXT_TS;
const EXT_ARR = EXT.split(',').map((x) => x.trim());

module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [`<rootDir>/src/**/*.{${EXT}}`],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  moduleFileExtensions: EXT_ARR.concat(['json']),
  testMatch: [`**/__tests__/**/*.{${EXT}}`, `**/?(*.)+(spec|test).{${EXT}}`],
  testPathIgnorePatterns: ['/node_modules/'],
  transform: { [`^.+\\.(${EXT_ARR.join('|')})$`]: 'babel-jest' }
};
