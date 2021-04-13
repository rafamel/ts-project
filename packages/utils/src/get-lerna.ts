import fs from 'fs';
import path from 'path';
import { Serial } from 'type-core';

export function getLerna(cwd: string): Serial.Object | null {
  const file = path.join(cwd, 'lerna.json');
  try {
    fs.accessSync(file, fs.constants.F_OK);
  } catch (_) {
    return null;
  }
  return JSON.parse(String(fs.readFileSync(file)));
}
