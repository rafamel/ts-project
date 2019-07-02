// eslint-disable-next-line import/no-unresolved
import { PLATFORMS_MAP as PlatformsDeclaration } from '@ionic/core/dist/types/utils/platform';
import { isPlatform } from '@ionic/core';
import memoize from 'memoizee';

export type TPlatforms = keyof typeof PlatformsDeclaration | 'md';
export type TPlatformSelector<T> = { [P in TPlatforms]?: T };

const platform = memoize((platform: TPlatforms) => {
  return platform === 'md'
    ? !isPlatform(window, 'ios')
    : isPlatform(window, platform);
});

export default {
  is: platform,
  on<T>(
    ...args: [TPlatformSelector<T>] | [T, TPlatformSelector<T>]
  ): T | undefined {
    const defaults = (args.length > 1 ? args[0] : undefined) as T | undefined;
    const selector = (args.length > 1 ? args[1] : args[0]) as TPlatformSelector<
      T
    >;
    const keys = Object.keys(selector) as TPlatforms[];
    for (let key of keys) {
      if (platform(key)) return selector[key];
    }
    return defaults;
  }
};
