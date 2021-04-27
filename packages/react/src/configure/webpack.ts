import { Members, TypeGuard, UnaryFn } from 'type-core';
import { overrideStyle } from '@craco/craco/lib/features/webpack/style/style';

export interface ReconfigureWebpackStyle {
  css?: {
    /* See: https://github.com/webpack-contrib/css-loader */
    options?: Members | UnaryFn<Members, Members>;
  };
  sass?: {
    /* See: https://github.com/webpack-contrib/sass-loader */
    options?: Members | UnaryFn<Members, Members>;
  };
  postcss?: {
    env?: { autoprefixer?: Members; stage?: Members; features?: Members };
    plugins?: any[];
    /* See: https://github.com/postcss/postcss-loader */
    options?: Members | UnaryFn<Members, Members>;
  };
}

export function reconfigureWebpackStyles(
  style: ReconfigureWebpackStyle,
  webpack: Members
): Members {
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
            ? (x: Members): Members => cssOptions(x)
            : cssOptions
        },
        sass: {
          loaderOptions: TypeGuard.isEmpty(sassOptions)
            ? <T>(x: T): T => x
            : TypeGuard.isFunction(sassOptions)
            ? (x: Members): Members => sassOptions(x)
            : sassOptions
        },
        postcss: {
          ...postcssConfig,
          mode: 'extends',
          loaderOptions: TypeGuard.isEmpty(postcssOptions)
            ? <T>(x: T): T => x
            : TypeGuard.isFunction(postcssOptions)
            ? (x: Members): Members => postcssOptions(x)
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
  webpack: Members
): Members {
  return {
    ...webpack,
    plugins: [...(webpack.plugins || []), ...plugins]
  };
}
