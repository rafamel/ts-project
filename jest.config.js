const project = require('./project.config');
const EXT =
  project.get('typescript') && project.get('ext.ts')
    ? project.get('ext.js') + ',' + project.get('ext.ts')
    : project.get('ext.js');
const EXT_ARR = EXT.split(',');

module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: [`<rootDir>/src/**/*.{${EXT}}`],
  modulePathIgnorePatterns: [
    '<rootDir>/build',
    '<rootDir>/src/@types',
    '<rootDir>/src/bin',
    '<rootDir>/src/.*/__mocks__'
  ],
  moduleFileExtensions: EXT_ARR.concat(['json']),
  testPathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/scripts/jest/setup.js'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$':
      '<rootDir>/scripts/jest/mocks/css-module.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/scripts/jest/mocks/image.js'
  },
  snapshotSerializers: ['enzyme-to-json/serializer']
};
