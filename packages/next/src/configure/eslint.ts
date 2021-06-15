import { Serial } from 'type-core';
import { paths } from '../paths';

export function reconfigureEslintNext(eslint: Serial.Object): Serial.Object {
  return {
    ...eslint,
    extends: [
      ...((eslint.extends as Serial.Array) || []),
      paths.eslint.configReactApp
    ]
  };
}
