import path from 'path';
import fs from 'fs-extra';
import { IOptionsCommon, IProjectCommon } from './types';
import withDefaults from './defaults';
import slim from 'slimconf';
import getScripts from './scripts';

export default function create(options: IOptionsCommon = {}): IProjectCommon {
  const defaults = withDefaults(options);
  const { paths, monorepo } = defaults.common;

  const pkgPath = path.join(paths.root, 'package.json');
  const exists = fs.pathExistsSync(pkgPath);
  if (!exists) {
    throw Error(
      `Project package.json couldn't be located at project root path`
    );
  }
  const pkg = fs.readJsonSync(pkgPath);

  if (
    monorepo &&
    (pkg.husky || (pkg.devDependencies && pkg.devDependencies.husky))
  ) {
    throw Error(
      `Monorepo packages shouldn't have husky configured or as a dependency`
    );
  }

  return {
    package: pkg,
    options: slim(defaults.common),
    scripts: getScripts(defaults.common)
  };
}
