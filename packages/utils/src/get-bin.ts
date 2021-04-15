import path from 'path';
import resolve from 'resolve-from';

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

  if (!pkg.bin || !Object.hasOwnProperty.call(pkg.bin, bin)) {
    throw Error(`Executable ${bin} not found for ${lib}`);
  }

  return from
    ? resolve(from, path.join(lib, pkg.bin[bin]))
    : require.resolve(path.join(lib, pkg.bin[bin]));
}
