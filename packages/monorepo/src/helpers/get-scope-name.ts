import { TypeGuard } from 'type-core';
import path from 'path';
import { getMonorepoRoot, getPackage } from '@riseup/utils';

export function getScopeName(cwd: string): string {
  const pkg = getPackage(cwd);
  const name = pkg && pkg.name;
  if (TypeGuard.isString(name)) return name;

  const root = getMonorepoRoot(cwd);

  return root
    ? path.relative(root, cwd)
    : cwd.split(path.win32.sep).slice(-1)[0].split(path.posix.sep).slice(-1)[0];
}
