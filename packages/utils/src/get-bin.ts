import path from 'path';
import resolve from 'resolve-from';
import { TypeGuard } from 'type-core';

/**
 * Resolves the path for a module bin file.
 */
export function getBin(lib: string, bin: string, from: string | null): string {
  const filepath = path.join(lib, 'package.json');

  let pkg: any;
  try {
    pkg = require(from ? resolve(from, filepath) : require.resolve(filepath));
  } catch (_) {
    throw Error(`Module "${lib}" not found`);
  }

  if (!pkg.bin) {
    throw Error(`No executable found for ${lib}`);
  }

  const file: string | null = TypeGuard.isString(pkg.bin)
    ? lib === bin
      ? pkg.bin
      : null
    : TypeGuard.isRecord(pkg.bin)
    ? pkg.bin[bin] || null
    : null;

  if (file === null) {
    throw Error(`Executable ${bin} not found for ${lib}`);
  }

  return from
    ? resolve(from, path.join(lib, file))
    : require.resolve(path.join(lib, file));
}
