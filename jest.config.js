const { EXTENSIONS } = require('./project.config');
const EXT_ARR = EXTENSIONS.split(',').map((x) => x.replace('.', ''));

module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [`<rootDir>/src/**/*{${EXTENSIONS}}`],
  modulePathIgnorePatterns: ['<rootDir>/build'],
  moduleFileExtensions: EXT_ARR,
  transform: {
    [`^.+\\.(${EXT_ARR.join('|')})$`]: 'babel-jest'
  }
};
