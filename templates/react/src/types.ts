import { theme } from './theme';

export interface IOfType<T> {
  [key: string]: T;
}

export interface IContext {
  theme: typeof theme;
}
