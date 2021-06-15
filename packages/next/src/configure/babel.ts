import { Serial } from 'type-core';
import { reconfigureBabelEnv } from '@riseup/tooling';
import { paths } from '../paths';

export function reconfigureBabelNext(babel: Serial.Object): Serial.Object {
  const config = reconfigureBabelEnv(null, babel);

  return {
    ...config,
    presets: [
      paths.babel.presetNext,
      ...((config.presets as Serial.Array) || []).filter((preset) => {
        const str = Array.isArray(preset) ? preset[0] : preset;
        return str !== paths.babel.presetNext;
      })
    ]
  };
}
