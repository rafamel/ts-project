import { Serial } from 'type-core';

export function reconfigureJestNext(jest: Serial.Object): Serial.Object {
  return {
    ...jest,
    testEnvironment: 'jsdom'
  };
}
