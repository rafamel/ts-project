import { Serial } from 'type-core';
import { paths } from '../paths';

export function reconfigureEslintReact(eslint: Serial.Object): Serial.Object {
  const settings = (eslint.settings as Serial.Object) || {};
  const resolver = (settings['import/resolver'] as Serial.Object) || {};
  const alias = (resolver.alias as Serial.Object) || {};

  return {
    ...eslint,
    extends: [
      ...((eslint.extends as Serial.Array) || []),
      paths.eslint.configReactApp
    ],
    settings: {
      ...settings,
      'import/resolver': {
        ...resolver,
        alias: {
          ...alias,
          extensions: 'json,jpg,jpeg,png,gif,bmp,html,css,scss'
            .split(',')
            .map((ext) => '.' + ext)
            .concat((alias.extensions as string[]) || [])
        }
      }
    }
  };
}
