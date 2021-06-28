import { Serial } from 'type-core';
import { getTypeScriptPath } from '@riseup/utils';
import { paths } from '../paths';

export function configureTypescript(cwd: string): Serial.Object {
  const file = getTypeScriptPath(cwd) || paths.typescript.config;
  return {
    extends: file,
    exclude: ['node_modules'],
    compilerOptions: {
      baseUrl: cwd,
      plugins: [
        {
          transform: paths.typescript.transformPaths
        }
      ]
    }
  };
}
