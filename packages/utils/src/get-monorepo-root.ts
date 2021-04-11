import minimatch from 'minimatch';
import up from 'find-up';
import path from 'path';
import fs from 'fs';

export function getMonorepoRoot(cwd: string): string | null {
  const lerna = up.sync('lerna.json', { cwd, type: 'file' });
  if (!lerna) return null;

  const pkg = up.sync('package.json', { cwd, type: 'file' });
  if (!pkg) return null;

  const rootDir = path.dirname(lerna);
  const childDir = path.dirname(pkg);
  if (rootDir.length >= childDir.length) return null;

  const lernaConfig = JSON.parse(String(fs.readFileSync(lerna)));
  if (!lernaConfig.packages) return null;
  if (!Array.isArray(lernaConfig.packages)) return null;

  for (const glob of lernaConfig.packages) {
    if (minimatch(childDir, path.resolve(cwd, glob))) return rootDir;
  }
  return null;
}
