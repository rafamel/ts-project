import { Serial } from 'type-core';
import { getTypeScript } from '@riseup/utils';
import { paths } from '../paths';

export function configureTypescript(cwd: string): Serial.Object {
  const file = getTypeScript(cwd) || paths.typescript.config;
  return {
    extends: file,
    include: ['./src/**/*'],
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true
    }
  };
}
