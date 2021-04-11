import fs from 'fs';
import path from 'path';

export function getTypeScriptPath(cwd: string): string | null {
  try {
    const stat = fs.statSync(cwd);
    if (!stat.isDirectory()) throw Error(`Not a directory: ${cwd}`);
  } catch (_) {
    throw Error(`Project does not exist: ${cwd}`);
  }

  const file = path.join(cwd, 'tsconfig.json');
  try {
    fs.accessSync(file, fs.constants.F_OK);
    return file;
  } catch (_) {
    return null;
  }
}
