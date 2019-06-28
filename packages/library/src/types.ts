import {
  IOptionsTooling,
  IProjectTooling,
  IScriptsTooling
} from '@riseup/tooling';
import { TScriptFn } from 'kpo';
import { DeepRequired } from 'utility-types';
import { TBareConfig } from 'slimconf';

export interface IProjectLibrary extends IProjectTooling {
  options: TBareConfig<DeepRequired<IOptionsTooling>>;
  scripts: IScriptsLibrary;
}

export interface IScriptsLibrary extends IScriptsTooling {
  /* Repo */
  release: TScriptFn;
  /* Build */
  'build:pack': TScriptFn;
  'build:static': TScriptFn;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOptionsLibrary extends IOptionsTooling {}
