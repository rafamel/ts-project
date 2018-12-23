const webpack = require('webpack');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const ManifestPlugin = require('webpack-manifest-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const mergewith = require('lodash.mergewith');
const path = require('path');
const config = require('./setup.config.js');
const { requireEnv } = require('slimconf');

// Prepare
requireEnv(...config.env.require);

// DEVELOPMENT
const development = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    contentBase: config.paths.output,
    compress: true,
    hot: true,
    port: config.dev.port,
    overlay: config.dev.overlay,
    disableHostCheck: true
  },
  performance: { hints: false },
  output: {
    publicPath: config.publicUrl,
    filename: '[name].js',
    path: config.paths.output,
    chunkFilename: '[name].chunk.js',
    pathinfo: true // adds filename comments for require()
  },
  plugins: [
    new HtmlWebpackPlugin({ template: config.paths.template, inject: true }),
    // Hot Updates for CSS (currently only CSS)
    new webpack.HotModuleReplacementPlugin(),
    // Watches new dependencies installs so the server doesn't have to restart
    new WatchMissingNodeModulesPlugin('node_modules')
  ]
};

// PRODUCTION
const production = {
  mode: 'production',
  devtool: 'source-map',
  performance: {
    hints: 'warning',
    maxEntrypointSize: config.assets.maxSizeEntry,
    maxAssetSize: config.assets.maxSize
  },
  output: {
    publicPath: config.publicUrl,
    filename: '[name].[hash].js',
    path: config.paths.output,
    chunkFilename: '[name].[chunkhash].js'
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: { ecma: 8 },
          compress: { ecma: 5, comparisons: false, warnings: false, inline: 2 },
          mangle: true,
          output: { ecma: 5, comments: false, ascii_only: true }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          parser: safePostCssParser,
          map: { inline: false, annotation: true }
        }
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: config.paths.template,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),
    new CleanWebpackPlugin([config.paths.output.split('/').pop()], {
      root: config.paths.base
    }),
    config.generateSW &&
      new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        exclude: [/\.map$/, /asset-manifest\.json$/],
        importWorkboxFrom: 'cdn',
        navigateFallback:
          config.publicUrl.replace(/(^\.)?\/$/, '') + '/index.html',
        navigateFallbackBlacklist: [
          // Exclude URLs starting with /_, as they're likely an API call
          new RegExp('^/_'),
          // Exclude URLs containing a dot, as they're likely a resource in
          // public/ and not a SPA route
          new RegExp('/[^/]+\\.[^/]+$')
        ]
      })
  ].filter(Boolean)
};

// BASE
const base = {
  target: 'web',
  entry: config.paths.entry,
  optimization: {
    runtimeChunk: true,
    splitChunks: { name: 'all', name: false }
  },
  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        enforce: 'pre',
        test: /\.(js|mjs|jsx)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
        options: { emitWarning: process.env.NODE_ENV !== 'production' }
      },
      {
        oneOf: [
          {
            // Application
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
              cacheDirectory: true,
              cacheCompression: true,
              // So the browser debugger shows the evaluated code
              sourceMaps: false
            }
          },
          {
            // Dependencies
            test: /\.(js|mjs)$/,
            loader: 'babel-loader',
            exclude: /@babel(?:\/|\\{1,2})runtime/,
            options: {
              cacheDirectory: true,
              cacheCompression: process.env.NODE_ENV === 'production',
              // So the browser debugger shows the evaluated code
              sourceMaps: false
            }
          },
          {
            test: /\.(jpg|jpeg|png|gif|bmp)$/,
            use: {
              loader: 'url-loader',
              options: { limit: 100 * 1024 /* 100kB */ }
            }
          },
          { test: /\.html$/, use: 'html-loader' },
          {
            test: /\.(css|scss)$/,
            use: [
              'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    require('postcss-preset-env')({
                      autoprefixer: { flexbox: 'no-2009' },
                      stage: 3
                    })
                  ]
                }
              },
              'sass-loader'
            ]
          },
          {
            loader: 'file-loader',
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/]
          }
        ]
      }
    ]
  },
  serve: {
    add: (app) => app.use(convert(history())),
    content: config.paths.entry,
    dev: { publicPath: config.paths.output },
    open: true
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss']
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // Make env available on JS
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(config.env.define)
    }),
    // Make env available on template
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, config.env.define),
    // Prevent moment from including all locales
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Provides context to not found errors
    new ModuleNotFoundPlugin(config.paths.base),
    // Copy assets
    new CopyWebpackPlugin(
      (() => {
        const getRelative = (file) => {
          file = path.resolve(file);
          const assets = path.resolve(config.paths.assets);
          const split = (path.parse(file).dir + '/').split(assets + '/');
          return split.length > 1 && !split[0]
            ? path.join(
                split.slice(1).join(assets + '/'),
                path.parse(file).base
              )
            : null;
        };
        return [
          {
            context: config.paths.assets,
            from: '*',
            to: config.paths.output,
            // Adds template relative to assets path to ignore IF
            // it's within that path
            ignore: [].concat(getRelative(config.paths.template) || [])
          },
          {
            context: config.paths.assets,
            from: '*/**/*',
            to: config.paths.output
          }
        ];
      })()
    ),
    // Generate assets manifest
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: config.publicUrl
    })
  ]
};

module.exports = mergewith(
  process.env.NODE_ENV === 'production' ? production : development,
  base,
  (obj, src) => (Array.isArray(obj) ? obj.concat(src) : undefined)
);
