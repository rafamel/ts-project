import { TScriptFn } from 'kpo';
import { DeepRequired, Omit } from 'utility-types';
import { TBareConfig } from 'slimconf';
import { IOptionsCommon, IProjectCommon, IScriptsCommon } from '@riseup/common';

export interface IProjectMonorepo extends Omit<IProjectCommon, 'options'> {
  options: TBareConfig<DeepRequired<IOptionsMonorepo>>;
  scripts: IScriptsMonorepo;
}

export interface IScriptsMonorepo extends IScriptsCommon {
  release: TScriptFn;
  test: TScriptFn;
  'test:coverage': TScriptFn;
  validate: TScriptFn;
}

export interface IOptionsMonorepo extends Omit<IOptionsCommon, 'monorepo'> {
  packages?: {
    content?: 'pkg';
  };
}
