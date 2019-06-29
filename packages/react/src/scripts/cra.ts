import fs from 'fs-extra';
import { bin } from '@riseup/common';
import { IOptionsTooling, ENV_OPTIONS_TOOLING } from '@riseup/tooling';
import { TScriptFn } from 'kpo';
import resolve from 'resolve-from';
import { IOptionsReact } from '~/types';
import { defineEnv } from '~/utils';
import { DeepRequired } from 'utility-types';

export default function cra(
  args: string[],
  tooling: DeepRequired<IOptionsTooling>,
  options: DeepRequired<IOptionsReact>
): TScriptFn {
  return async (argv: string[] = []) => {
    // Allow own TS config for CRA
    const filePath = resolve(
      require.resolve('@craco/craco'),
      'react-scripts/scripts/utils/verifyTypeScriptSetup'
    );
    await fs.writeFile(filePath, 'module.exports = function () {};');

    return bin('@craco/craco', 'craco', {
      env: {
        ...defineEnv(options.assign.env),
        [ENV_OPTIONS_TOOLING]: JSON.stringify(tooling)
      },
      args: (args || []).concat(argv)
    });
  };
}
