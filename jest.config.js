const hook = require('./setup/hook');
hook();

const jest = require('./setup/project/jest.config');
module.exports = {
  ...jest,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup/jest/setup.js'],
  moduleNameMapper: {
    '.*\\.(css|less|styl|scss|sass)$':
      '<rootDir>/setup/jest/mocks/css-module.js',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/setup/jest/mocks/image.js'
  },
  snapshotSerializers: ['enzyme-to-json/serializer']
};
