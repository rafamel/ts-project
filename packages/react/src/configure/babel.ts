import { Serial } from 'type-core';
import { reconfigureBabel } from '@riseup/tooling';
import { paths } from '../paths';

export function reconfigureBabelReact(babel: Serial.Object): Serial.Object {
  const rc = reconfigureBabel({ env: null }, babel);

  return {
    ...rc,
    presets: [
      paths.babel.presetReactApp,
      ...((rc.presets as Serial.Array) || [])
    ]
  };
}
