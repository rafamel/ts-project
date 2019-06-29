import { IOfType, IOptionsReact } from '~/types';
import { DeepRequired } from 'utility-types';

export default function getBabel({
  typescript,
  assign
}: DeepRequired<IOptionsReact>): IOfType<any> {
  return {
    presets: [[require.resolve('babel-preset-react-app'), { typescript }]],
    plugins: [
      assign.alias
        ? [
            require.resolve('babel-plugin-module-resolver'),
            { alias: assign.alias }
          ]
        : '',
      require.resolve('@babel/plugin-syntax-import-meta')
    ].filter(Boolean)
  };
}
