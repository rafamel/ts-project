import { Empty, Serial, TypeGuard } from 'type-core';
import { deep, shallow } from 'merge-strategies';
import { getPackage } from '@riseup/utils';
import { defaults } from '../defaults';

export interface ConfigureTypedocParams {
  name?: string;
  version?: string;
  overrides?: Serial.Object;
}

export interface ConfigureTypedocOptions extends ConfigureTypedocParams {
  root?: string;
}

export function configureTypedoc(
  options: ConfigureTypedocOptions | Empty
): Serial.Object {
  const opts = shallow(
    {
      root: defaults.global.root,
      overrides: defaults.docs.overrides
    },
    options || undefined
  );

  if (TypeGuard.isEmpty(opts.name) || TypeGuard.isEmpty(opts.version)) {
    const pkg = getPackage(opts.root);
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
