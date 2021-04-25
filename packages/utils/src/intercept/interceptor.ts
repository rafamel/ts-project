/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';
import path from 'path';
import mockery from 'mockery';
import { collect } from 'ensurism';
import { constants } from '../constants';

const env = collect(process.env, ({ ensure }) => ({
  [constants.interceptor.env.original]: ensure('string', { assert: true }),
  [constants.interceptor.env.replacement]: ensure('string', { assert: true })
}));

const original = path.normalize(env[constants.interceptor.env.original]);
const replacement = path.normalize(env[constants.interceptor.env.replacement]);

mockery.enable({
  warnOnReplace: true,
  warnOnUnregistered: false
});

mockery.registerMock(original, require(replacement));

mockery.registerMock('fs', {
  ...fs,
  access(file: fs.PathLike, ...args: any[]) {
    return (fs.access as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  },
  accessSync(file: fs.PathLike, ...args: any[]) {
    return (fs.accessSync as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  },
  readFile(file: fs.PathLike, ...args: any[]) {
    return (fs.readFile as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  },
  readFileSync(file: fs.PathLike, ...args: any[]) {
    return (fs.readFileSync as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  },
  stat(file: fs.PathLike, ...args: any[]) {
    return (fs.stat as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  },
  statSync(file: fs.PathLike, ...args: any[]) {
    return (fs.statSync as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  },
  lstat(file: fs.PathLike, ...args: any[]) {
    return (fs.lstat as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  },
  lstatSync(file: fs.PathLike, ...args: any[]) {
    return (fs.lstatSync as any)(
      path.normalize(String(file)) === original ? replacement : file,
      ...args
    );
  }
});
