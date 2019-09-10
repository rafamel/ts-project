import { TScriptFn } from 'kpo';
import { DeepPartial, DeepRequired } from 'utility-types';
import { TBareConfig } from 'slimconf';
import {
  IOptionsCommon,
  IProjectCommon,
  IScriptsCommon,
  IOptionsCommonPaths
} from '@riseup/common';

export interface IOfType<T> {
  [key: string]: T;
}

export interface IProjectTooling extends IProjectCommon {
  options: TBareConfig<DeepRequired<IOptionsTooling>>;
  babel: DeepPartial<IOfType<any>>;
  eslint: DeepPartial<IOfType<any>>;
  jest: DeepPartial<IOfType<any>>;
  typedoc: DeepPartial<IOfType<any>>;
  scripts: IScriptsTooling;
}

export interface IScriptsTooling extends IScriptsCommon {
  /* Build */
  build: TScriptFn;
  'build:transpile': TScriptFn;
  'build:types': TScriptFn;
  /* Fix */
  'fix:code': TScriptFn;
  /* Lint */
  'lint:code': TScriptFn;
  'lint:types': TScriptFn;
  /* Test */
  test: TScriptFn;
  verify: TScriptFn;
  validate: TScriptFn;
  /* Docs */
  docs: TScriptFn;
}

export interface IOptionsTooling extends IOptionsCommon {
  typescript?: boolean;
  paths?: IOptionsToolingPaths;
  assign?: IOptionsToolingAssign;
  version?: IOptionsToolingVersion;
  extend?: IOptionsToolingExtend;
}

export interface IOptionsToolingPaths extends IOptionsCommonPaths {
  build?: string;
}

export interface IOptionsToolingAssign {
  todo?: string[];
  alias?: IOfType<string>;
}

export interface IOptionsToolingVersion {
  docs?: boolean;
  build?: boolean;
}

export interface IOptionsToolingExtend {
  babel?: IExtend | IExtend[];
  eslint?: IExtend | IExtend[];
  jest?: IExtend | IExtend[];
  typedoc?: IExtend | IExtend[];
}

export interface IExtend {
  strategy?: 'replace' | 'shallow' | 'merge' | 'deep';
  configure: any;
}
