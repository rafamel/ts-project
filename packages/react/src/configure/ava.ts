import { Serial } from 'type-core';
import { tmpFile } from '@riseup/utils';
import { paths } from '../paths';

export function reconfigureAvaReact(ava: Serial.Object): Serial.Object {
  const react = tmpFile(
    'js',
    `global.React = require(${JSON.stringify(require.resolve('react'))});`
  );

  return {
    ...ava,
    require: [
      paths.ava.globalJsdomRegister,
      ...((ava.require as Serial.Array) || []).filter(
        (x) => x !== paths.ava.globalJsdomRegister
      ),
      react
    ]
  };
}
