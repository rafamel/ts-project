import { Empty, Serial } from 'type-core';
import { getTypeScript } from '@riseup/utils';
import { paths } from '../paths';

export interface ConfigureTypescriptOptions {
  root?: string;
}

export function configureTypescript(
  options: ConfigureTypescriptOptions | Empty
): Serial.Object {
  const file =
    (options && options.root && getTypeScript(options.root)) ||
    paths.typescript.config;

  return {
    extends: file,
    include: ['./src/**/*'],
    compilerOptions: {
      declaration: true,
      emitDeclarationOnly: true
    }
  };
}
