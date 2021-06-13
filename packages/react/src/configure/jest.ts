import { Serial } from 'type-core';
import { tmpFile } from '@riseup/utils';

export function reconfigureJestReact(jest: Serial.Object): Serial.Object {
  const react = tmpFile(
    'js',
    `global.React = require(${JSON.stringify(require.resolve('react'))});`
  );

  return {
    ...jest,
    testEnvironment: 'jsdom',
    setupFiles: [react, ...((jest as any).setupFiles || [])]
  };
}
