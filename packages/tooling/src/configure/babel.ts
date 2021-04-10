import { Deep, Empty, Members, Serial } from 'type-core';
import { shallow } from 'merge-strategies';
import { hydrateToolingGlobal } from '../global';
import { defaults } from '../defaults';
import { paths } from '../paths';

export interface ConfigureBabelParams {
  targets?: Serial.Object;
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
      targets: defaults.transpile.targets
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
      [paths.babel.presetEnv, getPresetEnvConfig(opts.targets)],
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
  return {
    ...configuration,
    presets:
      options && options.targets
        ? [
            [paths.babel.presetEnv, getPresetEnvConfig(options.targets)],
            ...((configuration as any).presets || []).filter(
              (preset: string | [string, ...any]) => {
                return !(Array.isArray(preset)
                  ? preset[0].includes('@babel/preset-env')
                  : preset.includes('@babel/preset-env'));
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
                return !(Array.isArray(plugin)
                  ? plugin[0].includes('babel-plugin-module-resolver')
                  : plugin.includes('babel-plugin-module-resolver'));
              }
            )
          ]
        : (configuration as any).plugins || []
  };
}

function getPresetEnvConfig(targets: Serial.Object): Serial.Object {
  const esnext = !targets.node && targets.esmodules;

  return esnext
    ? {
        modules: false,
        spec: true,
        targets
      }
    : { targets };
}
