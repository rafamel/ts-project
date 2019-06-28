import { extensions } from '~/utils';
import { IOfType, IOptionsTooling } from '~/types';
import { DeepRequired } from 'utility-types';

export default function getJest({
  typescript
}: DeepRequired<IOptionsTooling>): IOfType<any> {
  const ext = extensions({ typescript });
  return {
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: [
      `<rootDir>/src/**/*.{${ext.js.concat(ext.ts).join(',')}}`
    ],
    modulePathIgnorePatterns: [
      '.*\\.d\\.ts$',
      '<rootDir>/pkg',
      '<rootDir>/dist',
      '<rootDir>/src/@types',
      '<rootDir>/src/.*/__mocks__'
    ],
    moduleFileExtensions: ['json'].concat(ext.js).concat(ext.ts),
    testPathIgnorePatterns: ['/node_modules/'],
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': require.resolve('./transform')
    }
  };
}
