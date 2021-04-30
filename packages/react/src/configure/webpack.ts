import { Dictionary, TypeGuard, UnaryFn } from 'type-core';
import { overrideStyle } from '@craco/craco/lib/features/webpack/style/style';

export interface ReconfigureWebpackStyle {
  css?: {
    /* See: https://github.com/webpack-contrib/css-loader */
    options?: Dictionary | UnaryFn<Dictionary, Dictionary>;
  };
  sass?: {
    /* See: https://github.com/webpack-contrib/sass-loader */
    options?: Dictionary | UnaryFn<Dictionary, Dictionary>;
  };
  postcss?: {
    env?: {
      autoprefixer?: Dictionary;
      stage?: Dictionary;
      features?: Dictionary;
    };
    plugins?: any[];
    /* See: https://github.com/postcss/postcss-loader */
    options?: Dictionary | UnaryFn<Dictionary, Dictionary>;
  };
}

export function reconfigureWebpackStyles(
  style: ReconfigureWebpackStyle,
  webpack: Dictionary
): Dictionary {
  const { css, sass, postcss } = style;
  const { options: cssOptions } = css || {};
  const { options: sassOptions } = sass || {};
  const { options: postcssOptions, ...postcssConfig } = postcss || {};

  return overrideStyle(
    {
      style: {
        css: {
          loaderOptions: TypeGuard.isEmpty(cssOptions)
            ? <T>(x: T): T => x
            : TypeGuard.isFunction(cssOptions)
            ? (x: Dictionary): Dictionary => cssOptions(x)
            : cssOptions
        },
        sass: {
          loaderOptions: TypeGuard.isEmpty(sassOptions)
            ? <T>(x: T): T => x
            : TypeGuard.isFunction(sassOptions)
            ? (x: Dictionary): Dictionary => sassOptions(x)
            : sassOptions
        },
        postcss: {
          ...postcssConfig,
          mode: 'extends',
          loaderOptions: TypeGuard.isEmpty(postcssOptions)
            ? <T>(x: T): T => x
            : TypeGuard.isFunction(postcssOptions)
            ? (x: Dictionary): Dictionary => postcssOptions(x)
            : postcssOptions
        }
      }
    },
    webpack,
    {}
  );
}

export function reconfigureWebpackAddPlugins(
  plugins: any[],
  webpack: Dictionary
): Dictionary {
  return {
    ...webpack,
    plugins: [...(webpack.plugins || []), ...plugins]
  };
}
