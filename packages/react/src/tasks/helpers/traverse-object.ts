/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { UnaryFn } from 'type-core';

export function traverseObject(item: any, cb: UnaryFn<any, void>): void {
  cb(item);
  if (item && typeof item === 'object') {
    for (const key of Object.keys(item)) {
      traverseObject(item[key], cb);
    }
  }
}
