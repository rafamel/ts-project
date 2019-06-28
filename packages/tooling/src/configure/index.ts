import create from '~/index';
import { ENV_OPTIONS_TOOLING } from '~/constants';
import resolve from 'resolve-from';
import { IOfType, IProjectTooling } from '~/types';

export default function getConfigure(key: keyof IProjectTooling): IOfType<any> {
  const files: { [P in keyof IProjectTooling]?: string } = {
    babel: '.babelrc',
    eslint: '.eslintrc',
    jest: 'jest.config',
    typedoc: 'typedoc'
  };
  if (!files[key]) {
    throw Error(`Invalid configure key: ${key}`);
  }

  const project = process.env[ENV_OPTIONS_TOOLING]
    ? create(JSON.parse(process.env[ENV_OPTIONS_TOOLING] as string))
    : null;
  const root = project ? project.options.get('paths.root') : process.cwd();

  const filePath = resolve.silent(root, `./${files[key]}`);
  if (filePath) return require(filePath);
  if (!project) {
    throw Error(`${files[key]}.js not found at: ${root}`);
  }

  return project[key];
}
