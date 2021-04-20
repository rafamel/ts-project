import { Deep, Empty, Members, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import path from 'path';
import { hydrateToolingGlobal } from '../global';
import { paths } from '../paths';

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

export function reconfigureBabel(
  options: ConfigureBabelOptions | Empty,
  configuration: Serial.Object
): Serial.Object {
  const presetEnvPartial = [
    '@babel' + path.posix.sep + 'preset-env',
    '@babel' + path.win32.sep + 'preset-env'
  ];

  return {
    ...configuration,
    presets:
      options && (options.env || options.env === null)
        ? [
            ...(options.env === null
              ? []
              : [[paths.babel.presetEnv, options.env]]),
            ...((configuration as any).presets || []).filter(
              (preset: string | [string, ...any]) => {
                const str = Array.isArray(preset) ? preset[0] : preset;
                for (const partial of presetEnvPartial) {
                  if (str.includes(partial)) return false;
                }
                return true;
              }
            )
          ]
        : (configuration as any).presets || [],
    plugins:
      options && options.alias
        ? [
            [
              paths.babel.pluginModuleResolver,
              { alias: (options && options.alias) || {} }
            ],
            ...((configuration as any).plugins || []).filter(
              (plugin: string | [string, ...any]) => {
                const str = Array.isArray(plugin) ? plugin[0] : plugin;
                return !str.includes('babel-plugin-module-resolver');
              }
            )
          ]
        : (configuration as any).plugins || []
  };
}
