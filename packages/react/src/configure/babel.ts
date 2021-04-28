import { Serial } from 'type-core';
import { reconfigureBabelEnv } from '@riseup/tooling';
import { paths } from '../paths';

export function reconfigureBabelReact(babel: Serial.Object): Serial.Object {
  const rc = reconfigureBabelEnv({ env: null }, babel);

  return {
    ...rc,
    presets: [
      paths.babel.presetReactApp,
      ...((rc.presets as Serial.Array) || [])
    ]
  };
}
