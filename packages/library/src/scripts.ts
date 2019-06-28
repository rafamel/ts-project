import { DeepRequired } from 'utility-types';
import { IOptionsLibrary, IScriptsLibrary } from '~/types';
import { IScriptsTooling } from '@riseup/tooling';

export default function getScripts(
  tooling: IScriptsTooling,
  options: DeepRequired<IOptionsLibrary>
): IScriptsLibrary {
  return {} as any;
}
