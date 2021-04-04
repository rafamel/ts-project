import fs from 'fs';
import path from 'path';
import hash from 'object-hash';
import { v4 as uuid } from 'uuid';
import { Serial } from 'type-core';
import { paths } from './paths';

export function tmpPath(
  seed?: Serial.Object | null,
  ext?: string | null
): string {
  try {
    fs.accessSync(paths.riseup.tmp, fs.constants.F_OK);
  } catch (err) {
    if (err) fs.mkdirSync(paths.riseup.tmp);
  }

  return path.resolve(
    paths.riseup.tmp,
    (seed
      ? hash(seed, {
          excludeValues: false,
          encoding: 'hex',
          ignoreUnknown: false,
          respectFunctionProperties: true,
          respectFunctionNames: true,
          respectType: true
        })
      : uuid()) + (ext || '')
  );
}
