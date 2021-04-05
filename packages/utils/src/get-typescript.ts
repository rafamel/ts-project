import fs from 'fs';
import path from 'path';
import { into } from 'pipettes';

export function getTypeScript(project: string): string | null {
  return into(
    null,
    () => {
      try {
        const stat = fs.statSync(project);
        return stat.isDirectory();
      } catch (_) {
        throw Error(`Project does not exist: ${project}`);
      }
    },
    (isDir) => {
      const file = isDir ? path.join(project, 'tsconfig.json') : project;
      try {
        fs.accessSync(file, fs.constants.F_OK);
        return file;
      } catch (_) {
        return null;
      }
    }
  );
}
