const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const project = require('../../project.config');
const path = require('path');

const jsts = project.ext.ts
  ? project.ext.js + ',' + project.ext.ts
  : project.ext.js;

module.exports = {
  target: 'web',
  entry: project.paths.entry,
  optimization: {
    runtimeChunk: true,
    splitChunks: { name: 'all', name: false }
  },
  module: {
    rules: [
      { parser: { requireEnsure: false } },
      {
        enforce: 'pre',
        test: regex(jsts),
        loader: 'eslint-loader',
        exclude: /(node_modules)/,
        options: { quiet: true }
      },
      {
        oneOf: [
          {
            // Application
            test: regex(jsts),
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
            test: regex(project.ext.js),
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
            test: regex(project.ext.image),
            use: {
              loader: 'url-loader',
              options: { limit: 100 * 1024 /* 100kB */ }
            }
          },
          { test: regex(project.ext.html), use: 'html-loader' },
          {
            test: regex(project.ext.style),
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
            exclude: [
              regex(jsts),
              regex(project.ext.image),
              regex(project.ext.html),
              regex(project.ext.style),
              /\.json$/
            ]
          }
        ]
      }
    ]
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['json']
      .concat(project.ext.js.split(','))
      .concat(project.ext.ts ? project.ext.ts.split(',') : [])
      .concat(project.ext.image.split(','))
      .concat(project.ext.html.split(','))
      .concat(project.ext.style.split(','))
      .filter(Boolean)
      .map((x) => '.' + x)
  },
  plugins: [
    new webpack.ProgressPlugin(),
    // Detect cirucular dependencies
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: false,
      cwd: process.cwd()
    }),
    // Make env available on JS
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(project.env.define)
    }),
    // Make env available on template
    new InterpolateHtmlPlugin(HtmlWebpackPlugin, project.env.define),
    // Prevent moment from including all locales
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // Provides context to not found errors
    new ModuleNotFoundPlugin(project.paths.base),
    // Copy assets
    new CopyWebpackPlugin(
      (() => {
        const getRelative = (file) => {
          file = path.resolve(file);
          const assets = path.resolve(project.paths.assets);
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
            context: project.paths.assets,
            from: '*',
            to: project.paths.output,
            // Adds template relative to assets path to ignore IF
            // it's within that path
            ignore: [].concat(getRelative(project.paths.template) || [])
          },
          {
            context: project.paths.assets,
            from: '*/**/*',
            to: project.paths.output
          }
        ];
      })()
    ),
    // Generate assets manifest
    new ManifestPlugin({
      fileName: 'asset-manifest.json',
      publicPath: project.publicUrl
    })
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};

function regex(str) {
  return new RegExp(
    '\\.(' +
      str
        .split(',')
        .filter(Boolean)
        .join('|') +
      ')$'
  );
}
