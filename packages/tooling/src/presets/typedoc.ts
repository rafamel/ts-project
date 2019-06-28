import { IProjectCommon, IOfType } from '@riseup/common';

export default function getTypedoc(
  pkg: IProjectCommon['package']
): IOfType<any> {
  return {
    name: pkg && pkg.name ? `${pkg.name} ${pkg.version || ''}` : undefined,
    mode: 'file',
    module: 'system',
    theme: 'default',
    includeDeclarations: true,
    excludePrivate: true,
    excludeProtected: true,
    excludeExternals: true,
    excludeNotExported: false,
    exclude: ['**/__mocks__/**/*']
  };
}
