import { Deep, Empty, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import {
  hydrateTranspile,
  TranspileConfig,
  TranspileOptions
} from '@riseup/tooling';
import { paths } from '../../paths';
import { defaults } from '../../defaults';

export interface ConfigurePikaParams {
  assets?: string[];
  multitarget?: boolean;
  destination?: string;
}

export type ConfigurePikaOptions = ConfigurePikaParams & TranspileOptions;

export type ConfigurePikaConfig = TranspileConfig;

export function hydrateConfigurePika(
  options: ConfigurePikaOptions | Empty
): Deep.Required<ConfigurePikaOptions> {
  return shallow(
    {
      ...hydrateTranspile(options),
      assets: defaults.build.assets,
      multitarget: defaults.build.multitarget,
      destination: defaults.build.destination
    },
    options || undefined
  );
}

export function configurePika(
  options: ConfigurePikaOptions | Empty,
  config: ConfigurePikaConfig
): Serial.Array {
  const opts = hydrateConfigurePika(options);

  return [
    ...[
      [paths.pika.transpile, { options: opts, config: { ...config } }],
      [paths.pika.assets, { files: opts.assets }]
    ],
    ...(opts.multitarget
      ? [
          [
            paths.pika.standard,
            { exclude: ['__mocks__/**/*', '__tests__/**/*'] }
          ],
          [paths.pika.web]
        ]
      : [])
  ];
}
