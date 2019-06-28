import { ENV_BABEL_ESNEXT } from '~/constants';
import { IOfType, IOptionsTooling } from '~/types';
import { DeepRequired } from 'utility-types';

export default function getBabel({
  typescript,
  assign
}: DeepRequired<IOptionsTooling>): IOfType<any> {
  const esnext = process.env[ENV_BABEL_ESNEXT];
  return {
    presets: [
      [
        require.resolve('@babel/preset-env'),
        esnext
          ? { modules: false, spec: true, targets: { esmodules: true } }
          : { targets: { node: '8.0.0' } }
      ],
      typescript ? require.resolve('@babel/preset-typescript') : ''
    ].filter(Boolean),
    plugins: [
      assign.alias
        ? [
            require.resolve('babel-plugin-module-resolver'),
            { alias: assign.alias }
          ]
        : '',
      [require.resolve('@babel/plugin-proposal-decorators'), false],
      [
        require.resolve('@babel/plugin-proposal-object-rest-spread'),
        { useBuiltIns: true }
      ],
      require.resolve('@babel/plugin-proposal-class-properties'),
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('@babel/plugin-syntax-import-meta'),
      esnext ? '' : require.resolve('babel-plugin-dynamic-import-node')
    ].filter(Boolean)
  };
}
