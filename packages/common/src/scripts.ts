import { IOptionsCommon, IScriptsCommon } from '~/types';
import { DeepRequired } from 'utility-types';

export default function getScripts({
  paths,
  clean,
  monorepo
}: DeepRequired<IOptionsCommon>): IScriptsCommon {
  return {} as any;
}
