/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';
import mockery from 'mockery';
import { coerce } from 'ensurism';
import { constants } from '../constants';

const pairsArr: any[] = coerce(
  process.env[constants.interceptor.env],
  {
    type: 'array',
    items: {
      type: 'object',
      required: ['original', 'replacement'],
      properties: {
        original: { type: 'string' },
        replacement: { type: 'string' }
      }
    }
  },
  { assert: true }
);

const pairsRecord = pairsArr.reduce(
  (acc, { original, replacement }) => ({
    ...acc,
    [original]: replacement
  }),
  {}
);

mockery.enable({
  warnOnReplace: true,
  warnOnUnregistered: false
});

for (const pair of pairsArr) {
  mockery.registerMock(pair.original, require(pair.replacement));
}

mockery.registerMock('fs', {
  ...fs,
  access(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.access as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  },
  accessSync(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.accessSync as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  },
  readFile(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.readFile as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  },
  readFileSync(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.readFileSync as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  },
  stat(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.stat as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  },
  statSync(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.statSync as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  },
  lstat(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.lstat as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  },
  lstatSync(file: fs.PathLike, ...args: any[]) {
    const filePath = path.normalize(String(file));
    return (fs.lstatSync as any)(
      Object.hasOwnProperty.call(pairsRecord, filePath)
        ? pairsRecord[filePath]
        : file,
      ...args
    );
  }
});
