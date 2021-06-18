import fs from 'fs';
import path from 'path';

export async function getRecursiveFiles(
  fileExt: string[],
  excludeDirNames: string[],
  dirs: string[]
): Promise<string[]> {
  if (!dirs.length) return [];

  const files: string[] = [];
  const dir = dirs[0];
  const pending = dirs.slice(1);

  const items = await new Promise<string[]>((resolve, reject) => {
    return fs.readdir(dir, (err, res) => (err ? reject(err) : resolve(res)));
  });
  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = await new Promise<fs.Stats>((resolve, reject) => {
      return fs.stat(itemPath, (err, res) => {
        return err ? reject(err) : resolve(res);
      });
    });
    if (stats.isDirectory()) {
      if (!excludeDirNames.includes(item)) pending.push(itemPath);
    } else {
      const ext = itemPath.split('.').slice(-1)[0];
      if (fileExt.includes(ext)) files.push(itemPath);
    }
  }

  return files.concat(
    await getRecursiveFiles(fileExt, excludeDirNames, pending)
  );
}
