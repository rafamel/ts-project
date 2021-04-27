/* eslint-disable @typescript-eslint/no-var-requires */
import { Members, Serial, TypeGuard } from 'type-core';
import { paths } from '../../paths';

export interface CracoConfigOptions {
  lint: boolean;
  server: Serial.Object | null;
  webpack: string | null;
  extensions: {
    js: string[];
    ts: string[];
  };
}

export interface CracoConfigFiles {
  babel: string;
  eslint: string;
}

export default function cracoConfig(
  options: CracoConfigOptions,
  files: CracoConfigFiles
): Members {
  const extensions = [...options.extensions.js, ...options.extensions.ts];

  return {
    ...(options.server ? { devServer: options.server } : {}),
    babel: {
      loaderOptions: (options: Members) => {
        const babel = require(files.babel);
        return {
          ...babel,
          ...options,
          plugins: [...(babel.plugins || []), ...(options.plugins || [])],
          presets: [
            ...(options.presets || []),
            ...(babel.presets || []).filter((x: string | any[]) => {
              const str = TypeGuard.isString(x) ? x : x[0];
              return !str.includes('babel-preset-react-app');
            })
          ]
        };
      }
    },
    eslint: {
      enable: options.lint,
      mode: 'file',
      pluginOptions: (options: Members) => ({
        ...options,
        extensions,
        emitWarning: true,
        useEslintrc: true,
        overrideConfigFile: files.eslint,
        resolvePluginsRelativeTo: paths.riseup.tooling
      })
    },
    webpack: {
      configure(config: Members) {
        const fn = options.webpack
          ? require(options.webpack)
          : <T>(x: T): T => x;

        return fn({
          ...config,
          resolve: {
            ...config.resolve,
            extensions: ['json', ...extensions].map((x) => '.' + x)
          }
        });
      }
    }
  };
}
