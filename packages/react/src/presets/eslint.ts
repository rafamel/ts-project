import path from 'path';
import { IOfType, IOptionsReact } from '~/types';
import { getEslint as getToolingEslint } from '@riseup/tooling';
import { DeepRequired } from 'utility-types';
import { merge } from 'merge-strategies';

export default function getEslint(
  opts: DeepRequired<IOptionsReact>
): IOfType<any> {
  const tooling = getToolingEslint({
    ...opts,
    paths: { ...opts.paths, build: path.join(opts.paths.root, 'build') }
  });

  return merge(tooling, {
    extends: [...tooling.extends, require.resolve('eslint-config-react-app')],
    settings: {
      'import/resolver': {
        alias: {
          extensions: 'js,jsx,ts,tsx,json,jpg,jpeg,png,gif,bmp,html,css,scss'
            .split(',')
            .map((ext) => '.' + ext)
        }
      }
    },
    // TODO: remove once eslint-config-react-app updates and removes
    // @typescript-eslint/no-angle-bracket-type-assertion (deprecated)
    overrides: opts.typescript
      ? [
          ...tooling.overrides,
          {
            files: ['*'],
            rules: { '@typescript-eslint/no-angle-bracket-type-assertion': 0 }
          }
        ]
      : tooling.overrides
  });
}
