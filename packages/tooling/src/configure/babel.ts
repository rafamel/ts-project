import { Deep, Empty, Members, Serial, TypeGuard, UnaryFn } from 'type-core';
import { shallow } from 'merge-strategies';
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
      [paths.babel.pluginModuleResolver, { alias: opts.alias }],
      [paths.babel.pluginModuleNameMapper, { moduleNameMapper: {} }]
    ]
  };
}

export function reconfigureBabelEnv(
  env: Serial.Object | null,
  babel: Serial.Object
): Serial.Object {
  return reconfigureBabelModifyHelper(
    'presets',
    'first',
    (str) => str === paths.babel.presetEnv,
    () => {
      return TypeGuard.isEmpty(env) ? null : [paths.babel.presetEnv, env];
    },
    babel
  );
}

export function reconfigureBabelAlias(
  alias: Members<string> | UnaryFn<Members<string>, Members<string>>,
  babel: Serial.Object
): Serial.Object {
  return reconfigureBabelModifyHelper(
    'plugins',
    'last',
    (str) => str === paths.babel.pluginModuleResolver,
    (item) => {
      const options = Array.isArray(item) ? item[1] || {} : {};
      return [
        paths.babel.pluginModuleResolver,
        {
          ...options,
          alias: TypeGuard.isFunction(alias)
            ? alias(options.alias || {}) || {}
            : alias || {}
        }
      ];
    },
    babel
  );
}

export function reconfigureBabelModuleMapper(
  maps: Members<string> | UnaryFn<Members<string>, Members<string>>,
  babel: Serial.Object
): Serial.Object {
  return reconfigureBabelModifyHelper(
    'plugins',
    'last',
    (str) => str === paths.babel.pluginModuleNameMapper,
    (item) => {
      const options = Array.isArray(item) ? item[1] || {} : {};
      return [
        paths.babel.pluginModuleNameMapper,
        {
          ...options,
          moduleNameMapper: TypeGuard.isFunction(maps)
            ? maps(options.moduleNameMapper || {}) || {}
            : maps || {}
        }
      ];
    },
    babel
  );
}

function reconfigureBabelModifyHelper(
  key: 'presets' | 'plugins',
  add: 'first' | 'last',
  match: UnaryFn<string, boolean>,
  fn: UnaryFn<null | string | [string, any], null | string | [string, any]>,
  babel: Serial.Object
): Serial.Object {
  let modified = false;
  const arr = ((babel[key] as Serial.Array) || []).map((item) => {
    const str = Array.isArray(item) ? item[0] : item;
    if (!match(str as string)) return item;

    modified = true;
    return fn(item as any);
  });

  return {
    ...babel,
    [key]: [
      ...(add === 'first' ? [] : arr),
      ...(modified ? [] : [fn(null)]),
      ...(add === 'first' ? arr : [])
    ].filter((item) => !TypeGuard.isEmpty(item))
  };
}
