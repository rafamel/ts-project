import path from 'path';
import { IMultiExecOptions, series, TScriptFn } from 'kpo';
import { IOfType } from '~/types';
import { NODE_PATH } from './constants';

export function bin(
  lib: string,
  name: string,
  opts: IMultiExecOptions = {}
): TScriptFn {
  return async (args?: string[]) => {
    return series(NODE_PATH, {
      ...opts,
      args: [route(lib, name)].concat(opts.args || []).concat(args || [])
    });
  };
}

export function route(lib: string, name: string): string {
  let pkg: IOfType<any>;
  try {
    pkg = require(`${lib}/package.json`);
  } catch (_) {
    throw Error(`Module ${lib} not found`);
  }

  if (!pkg.bin || !Object.hasOwnProperty.call(pkg.bin, name)) {
    throw Error(`Executable ${name} not found for ${lib}`);
  }

  return require.resolve(path.join(lib, pkg.bin[name]));
}

export function getRoot(options: { paths?: { root?: string } }): string {
  return (options.paths && options.paths.root) || process.cwd();
}
