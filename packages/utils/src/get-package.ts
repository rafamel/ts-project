import fs from 'fs';
import path from 'path';
import { Serial } from 'type-core';

export function getPackage(root: string): Serial.Object | null {
  const file = path.join(root, 'package.json');
  try {
    fs.accessSync(file, fs.constants.F_OK);
  } catch (_) {
    return null;
  }
  return JSON.parse(String(fs.readFileSync(file)));
}
