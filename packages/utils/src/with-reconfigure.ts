import { Empty, Dictionary, Serial, TypeGuard } from 'type-core';
import { Riseup } from './definitions';

export function withReconfigure<
  C extends Dictionary<Riseup.Configure<Serial.Type>>,
  R extends {
    [K in keyof C]?: ReturnType<C[K]> | Riseup.Reconfigure<ReturnType<C[K]>>;
  }
>(configure: C, reconfigure: R | Empty): C {
  return Object.entries(configure).reduce(
    (acc: Dictionary<Riseup.Configure<Serial.Type>>, [key, value]) => {
      const param = reconfigure && reconfigure[key];
      return {
        ...acc,
        [key](context) {
          if (TypeGuard.isEmpty(param)) return value(context);
          return TypeGuard.isFunction(param)
            ? param(value(context) as any, context)
            : param;
        }
      };
    },
    {}
  ) as C;
}
