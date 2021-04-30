import { Empty, Dictionary, NullaryFn, Serial, TypeGuard } from 'type-core';
import { Riseup } from './definitions';

export type HandleReconfigureResponse<
  T extends Dictionary<Riseup.Reconfigure<any> | Serial.Type>,
  K extends keyof T
> =
  | Exclude<T[K], Empty | Riseup.Reconfigure<any>>
  | ReturnType<Exclude<T[K], Empty | Serial.Type>>;

export function handleReconfigure<
  T extends Dictionary<Riseup.Reconfigure<any> | Serial.Type>,
  K extends keyof T
>(
  context: Riseup.Context,
  reconfigure: T | Empty,
  key: K,
  fetcher: NullaryFn<HandleReconfigureResponse<T, K>>
): HandleReconfigureResponse<T, K> {
  if (!reconfigure) return fetcher();

  const param = reconfigure[key];

  if (TypeGuard.isEmpty(param)) return fetcher();
  if (TypeGuard.isFunction(param)) return param(fetcher(), context);
  return param as HandleReconfigureResponse<T, K>;
}
