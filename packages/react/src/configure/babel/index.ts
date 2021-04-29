import { Serial } from 'type-core';
import {
  reconfigureBabelEnv,
  reconfigureBabelModuleMapper
} from '@riseup/tooling';
import { paths } from '../../paths';

export function reconfigureBabelReact(babel: Serial.Object): Serial.Object {
  const config = reconfigureBabelModuleMapper(
    (maps) => ({
      ...maps,
      '^.+\\.(jpg|jpeg|png|gif|bmp|svg)$': paths.babel.mapperImage,
      '^.+\\.(css|scss|sass|less)$': paths.babel.mapperStyle
    }),
    reconfigureBabelEnv(null, babel)
  );

  return {
    ...config,
    presets: [
      paths.babel.presetReactApp,
      ...((config.presets as Serial.Array) || []).filter((preset) => {
        const str = Array.isArray(preset) ? preset[0] : preset;
        return str !== paths.babel.presetReactApp;
      })
    ]
  };
}
