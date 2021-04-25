import fs from 'fs';
import { Serial, TypeGuard } from 'type-core';
import { tmpPath } from './tmp-path';

export function tmpFile(
  ext: string | null,
  content: Serial.Object | Serial.Array | string
): string {
  const file = tmpPath(ext, { content });

  fs.writeFileSync(
    file,
    TypeGuard.isString(content) ? content : JSON.stringify(content, null, 2)
  );

  return file;
}
