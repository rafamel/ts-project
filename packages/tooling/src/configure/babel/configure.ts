import { Deep, Empty, Members, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import { hydrateToolingGlobal } from '../../global';
import { paths } from '../../paths';

export interface ConfigureBabelParams {
  env?: Serial.Object | null;
}

export interface ConfigureBabelOptions extends ConfigureBabelParams {
  alias?: Members<string>;
}

export function hydrateConfigureBabel(
  options: ConfigureBabelOptions | Empty
): Deep.Required<ConfigureBabelOptions> {
  return shallow(
    {
      ...hydrateToolingGlobal(options),
      env: { targets: 'defaults' } as any
    },
    options || undefined
  );
}

export function configureBabel(
  options: ConfigureBabelOptions | Empty
): Serial.Object {
  const opts = hydrateConfigureBabel(options);
  return {
    presets: [
      ...(opts.env === null ? [] : [[paths.babel.presetEnv, opts.env]]),
      paths.babel.presetTypeScript
    ],
    plugins: [
      [
        paths.babel.pluginModuleResolver,
        {
          alias: opts.alias
        }
      ]
    ]
  };
}
