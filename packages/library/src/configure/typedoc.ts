import { Deep, Empty, Serial, TypeGuard } from 'type-core';
import { deep, shallow } from 'merge-strategies';
import { getPackage } from '@riseup/utils';
import { defaults } from '../defaults';

export interface ConfigureTypedocParams {
  name?: string | null;
  version?: string | null;
  overrides?: Serial.Object;
}

export type ConfigureTypedocOptions = ConfigureTypedocParams;

export function hydrateConfigureTypedoc(
  options: ConfigureTypedocOptions | Empty
): Deep.Required<ConfigureTypedocOptions> {
  return shallow(
    { name: null, version: null, overrides: defaults.docs.overrides },
    options || undefined
  );
}

export function configureTypedoc(
  cwd: string,
  options: ConfigureTypedocOptions | Empty
): Serial.Object {
  const opts = hydrateConfigureTypedoc(options);

  if (TypeGuard.isEmpty(opts.name) || TypeGuard.isEmpty(opts.version)) {
    const pkg = getPackage(cwd);
    if (pkg) {
      opts.name = TypeGuard.isEmpty(opts.name)
        ? (pkg.name as string)
        : opts.name;
      opts.version = TypeGuard.isEmpty(opts.version)
        ? (pkg.version as string)
        : opts.version;
    }
  }

  return deep(
    {
      name:
        (opts.name ? opts.name + ' ' : '') +
        (opts.version ? 'v' + opts.version : ''),
      theme: 'default',
      excludeExternals: true,
      excludePrivate: true,
      excludeProtected: true,
      excludeInternal: true,
      exclude: ['**/__mocks__/**/*']
    },
    opts.overrides || undefined
  );
}
