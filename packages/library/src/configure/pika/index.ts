import { Empty, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import { TranspileConfig, TranspileOptions } from '@riseup/tooling';
import { paths } from '../../paths';
import { defaults } from '../../defaults';

export interface ConfigurePikaParams {
  assets?: string[];
  multitarget?: boolean;
  destination?: string;
}

export type ConfigurePikaOptions = ConfigurePikaParams & TranspileOptions;

export type ConfigurePikaConfig = TranspileConfig;

export function configurePika(
  options: ConfigurePikaOptions | Empty,
  config: ConfigurePikaConfig
): Serial.Array {
  const opts = shallow(
    {
      assets: defaults.build.assets,
      multitarget: defaults.build.multitarget,
      destination: defaults.build.destination
    },
    options || undefined
  );

  return [
    ...[
      [
        paths.pika.transpile,
        {
          options: { ...options, destination: opts.destination },
          config: { ...config }
        }
      ],
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
