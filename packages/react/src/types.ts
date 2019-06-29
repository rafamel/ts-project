import { DeepRequired, Omit } from 'utility-types';
import { TBareConfig } from 'slimconf';
import {
  IScriptsTooling,
  IOptionsTooling,
  IProjectTooling,
  IOptionsToolingPaths,
  IOptionsToolingAssign
} from '@riseup/tooling';
import { TScriptFn } from 'kpo';

export interface IOfType<T> {
  [key: string]: T;
}

export interface IProjectReact
  extends Omit<IProjectTooling, 'options' | 'scripts'> {
  options: TBareConfig<DeepRequired<IOptionsReact>>;
  scripts: IScriptsReact;
  craco: IOfType<any>;
}

export interface IScriptsReact
  extends Omit<IScriptsTooling, 'build:transpile' | 'build:types'> {
  start: TScriptFn;
  serve: TScriptFn;
  analyze: TScriptFn;
  'test:watch': TScriptFn;
}

export interface IOptionsReact extends IOptionsTooling {
  paths?: IOptionsReactPaths;
  assign?: IOptionsReactAssign;
  server?: IOptionsReactServer;
}

export interface IOptionsReactAssign extends IOptionsToolingAssign {
  env?: IOptionsReactAssignEnv;
}

export interface IOptionsReactAssignEnv {
  app?: IOfType<string | number>;
  process?: IOfType<string | number>;
}

export interface IOptionsReactServer {
  serve?: { port?: string };
  dev?: IOfType<any> & { open?: boolean };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOptionsReactPaths
  extends Omit<IOptionsToolingPaths, 'build'> {}
