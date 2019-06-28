import { IExtend } from './types';
import { shallow, deep, merge } from 'merge-strategies';

export function extend<T>(base: T, extend: IExtend | IExtend[]): any {
  const arr = Array.isArray(extend) ? extend : [extend];

  const value = arr.reduce((acc: any, item) => {
    const { strategy, configure } = item;
    if (configure === undefined) return acc;

    switch (strategy) {
      case 'replace':
        return configure;
      case 'shallow':
        return shallow(acc, configure);
      case 'merge':
        return merge(acc, configure);
      default:
        return deep(acc, configure);
    }
  }, base);

  return typeof value === 'object' && value !== null ? value : {};
}
