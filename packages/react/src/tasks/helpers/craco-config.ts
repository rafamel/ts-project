/* eslint-disable @typescript-eslint/no-var-requires */
import { Dictionary, Serial } from 'type-core';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { addHook } from 'pirates';
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
  typescript: string;
  eslint: string;
}

let setupChecksDeactivated = false;

export default function cracoConfig(
  options: CracoConfigOptions,
  files: CracoConfigFiles
): Dictionary {
  if (!setupChecksDeactivated) {
    setupChecksDeactivated = true;
    addHook((_code, _filename) => 'module.exports = () => undefined;', {
      exts: ['.js'],
      ignoreNodeModules: false,
      matcher: (filename) => {
        return filename.endsWith(
          'react-scripts/scripts/utils/verifyTypeScriptSetup.js'
        );
      }
    });
  }

  const extensions = [...options.extensions.js, ...options.extensions.ts];

  return {
    ...(options.server ? { devServer: options.server } : {}),
    babel: {
      loaderOptions: (options: Dictionary) => {
        const babel = require(files.babel);
        return {
          ...babel,
          ...options,
          presets: [...(options.presets || []), ...(babel.presets || [])],
          plugins: [...(options.plugins || []), ...(babel.plugins || [])]
        };
      }
    },
    eslint: {
      enable: options.lint,
      mode: 'file',
      pluginOptions: (options: Dictionary) => ({
        ...options,
        extensions,
        emitWarning: true,
        useEslintrc: true,
        overrideConfigFile: files.eslint,
        resolvePluginsRelativeTo: paths.riseup.tooling
      })
    },
    webpack: {
      configure(config: Dictionary) {
        const fn = options.webpack
          ? require(options.webpack)
          : <T>(x: T): T => x;

        return fn({
          ...config,
          resolve: {
            ...(config.resolve || {}),
            extensions: ['json', ...extensions].map((x) => '.' + x)
          },
          plugins: (config.plugins || []).map((plugin: any) => {
            return plugin.constructor.name === 'ForkTsCheckerWebpackPlugin'
              ? new ForkTsCheckerWebpackPlugin({
                  ...(plugin.options || {}),
                  tsconfig: files.typescript
                })
              : plugin;
          })
        });
      }
    }
  };
}
