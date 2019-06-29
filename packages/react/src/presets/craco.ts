/* eslint-disable @typescript-eslint/no-var-requires */
import { IOfType, IOptionsReact } from '~/types';
import { DeepRequired } from 'utility-types';
import { defineEnv } from '~/utils';
import { IProjectTooling } from '@riseup/tooling';

export default function getCraco(
  { server, assign }: DeepRequired<IOptionsReact>,
  tooling: IProjectTooling
): IOfType<any> {
  const HTMLWebpack = require('html-webpack-plugin');
  const Interpolate = require('react-dev-utils/InterpolateHtmlPlugin');

  const craco = {
    devServer: server.dev,
    babel: {
      presets: tooling.babel.presets.filter((x: string | any[]) => {
        if (typeof x === 'string') return !x.includes('react-app');
        else return !x[0].includes('react-app');
      }),
      plugins: tooling.babel.plugins
    },
    eslint: {
      loaderOptions: (options: any) => ({
        ...options,
        emitWarning: true,
        useEslintrc: true,
        configFile: require.resolve('@riseup/tooling/dist/configure/eslint')
      })
    },
    webpack: {
      plugins: [
        new Interpolate(
          HTMLWebpack,
          defineEnv({ app: assign.env.app, process: {} })
        )
      ]
    },
    jest: {
      configure: () => tooling.jest
    }
  };

  return craco;
}
