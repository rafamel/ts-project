/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path';

/**
 * Resolves the path for a module bin file.
 */
export function getBin(lib: string, bin: string): string {
  const filepath = path.join(lib, 'package.json');

  let pkg: any;
  try {
    pkg = require(filepath);
  } catch (_) {
    throw Error(`Module "${lib}" not found`);
  }

  if (!pkg.bin || !Object.hasOwnProperty.call(pkg.bin, bin)) {
    throw Error(`Executable ${bin} not found for ${lib}`);
  }

  return require.resolve(path.join(lib, pkg.bin[bin]));
}
