/* eslint-disable no-eval */
import { Dictionary } from 'type-core';
import { ufs as unionfs } from 'unionfs';
import { fs as memfs } from 'memfs';
import nativefs from 'fs';
import path from 'path';
import mockery from 'mockery';
import { coerce } from 'ensurism';
import { constants } from '../constants';

const filesArr: any[] = coerce(
  process.env[constants.interceptor.env],
  {
    type: 'array',
    items: {
      type: 'object',
      required: ['path', 'content', 'require'],
      properties: {
        path: { type: 'string' },
        content: { type: 'string' },
        require: {
          oneOf: [{ type: 'null' }, { type: 'string', enum: ['js', 'json'] }]
        }
      }
    }
  },
  { assert: true }
);

// Native filesystem with memfs backup
unionfs.use(memfs as any).use(nativefs);

// Create a native fs compatible object
const pathsArr = filesArr.map((file) => file.path);
const proxyfs = interceptMethods(nativefs, unionfs, pathsArr);
if (nativefs.promises) {
  proxyfs.promises = interceptMethods(
    nativefs.promises,
    unionfs.promises,
    pathsArr
  );
}

// Mock fs calls
mockery.enable({ warnOnReplace: true, warnOnUnregistered: false });
mockery.registerMock('fs', proxyfs);

for (const file of filesArr) {
  memfs.mkdirpSync(path.dirname(file.path));
  memfs.writeFileSync(file.path, file.content);

  if (file.require) {
    mockery.registerMock(
      file.path,
      file.require === 'js' ? eval(file.content) : JSON.parse(file.content)
    );
  }
}

function interceptMethods(
  native: Dictionary,
  replacement: Dictionary,
  paths: string[]
): Dictionary {
  const result: Dictionary = { ...native };

  for (const [key, value] of Object.entries(result)) {
    result[key] =
      typeof value === 'function'
        ? new Proxy(value, {
            apply(_, self, args) {
              return Object.hasOwnProperty.call(replacement, key) &&
                paths.includes(String(args[0]))
                ? replacement[key].apply(self, args)
                : native[key].apply(self, args);
            }
          })
        : value;
  }

  return result;
}
