import { TScriptFn } from 'kpo';
import { DeepRequired } from 'utility-types';
import { TBareConfig } from 'slimconf';

export interface IOfType<T> {
  [key: string]: T;
}

export interface IProjectCommon {
  package: IOfType<any>;
  options: TBareConfig<DeepRequired<IOptionsCommon>>;
  scripts: IScriptsCommon;
}

export interface IScriptsCommon {
  /* Repo */
  commit: TScriptFn;
  semantic: TScriptFn;
  /* Fix */
  fix: TScriptFn;
  'fix:scripts': TScriptFn;
  /* Lint */
  lint: TScriptFn;
  'lint:md': TScriptFn;
  'lint:scripts': TScriptFn;
  /* Clean */
  clean: TScriptFn;
  'clean:build': TScriptFn;
  'clean:modules': TScriptFn;
  /* Hooks */
  prepublishOnly: TScriptFn;
  preversion: TScriptFn;
  version: TScriptFn;
}

export interface IOptionsCommon {
  monorepo?: boolean;
  clean?: string[];
  paths?: IOptionsCommonPaths;
}

export interface IOptionsCommonPaths {
  root?: string;
  docs?: string;
}
