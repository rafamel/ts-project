import { Serial } from 'type-core';
import { paths } from '../paths';

export function reconfigureAvaReact(ava: Serial.Object): Serial.Object {
  return {
    ...ava,
    require: [
      paths.ava.globalJsdomRegister,
      ...((ava.require as Serial.Array) || []).filter(
        (x) => x !== paths.ava.globalJsdomRegister
      )
    ]
  };
}
