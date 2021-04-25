import fs from 'fs';
import path from 'path';
import hash from 'object-hash';
import { v4 as uuid } from 'uuid';
import { Serial } from 'type-core';
import { constants } from './constants';

export function tmpPath(
  ext: string | null,
  seed: Serial.Object | null
): string {
  try {
    fs.accessSync(constants.tmp, fs.constants.F_OK);
  } catch (err) {
    if (err) fs.mkdirSync(constants.tmp);
  }

  return path.resolve(
    constants.tmp,
    (seed
      ? hash(seed, {
          excludeValues: false,
          encoding: 'hex',
          ignoreUnknown: false,
          respectFunctionProperties: true,
          respectFunctionNames: true,
          respectType: true
        })
      : uuid()) + (ext ? '.' + ext : '')
  );
}
