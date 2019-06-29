import { IOfType, IOptionsReactAssignEnv } from './types';
import decamelize from 'decamelize';
import { DeepRequired } from 'utility-types';

export function defineEnv(
  envs: DeepRequired<IOptionsReactAssignEnv>
): IOfType<string> {
  const prefix = 'REACT_APP_';

  const app = Object.entries(envs.app);
  const process = Object.entries(envs.process);
  const response: IOfType<string> = {};
  trunk(app, true);
  trunk(process, false);
  return response;

  function trunk(
    entries: Array<[string, string | number]>,
    normalize?: boolean
  ): void {
    for (let [key, val] of entries) {
      if (!['string', 'number'].includes(typeof val)) continue;

      if (normalize) {
        key = decamelize(key).toUpperCase();
        if (!key.startsWith(prefix)) key = `${prefix}${key}`;
      }
      const value = String(val);
      response[key] = value;
    }
  }
}
