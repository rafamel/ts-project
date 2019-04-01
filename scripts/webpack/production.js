const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PostCSSSafeParser = require('postcss-safe-parser');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');
const project = require('../../project.config');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  performance: {
    hints: 'warning',
    maxEntrypointSize: project.get('assets.maxSizeEntry'),
    maxAssetSize: project.get('assets.maxSize')
  },
  output: {
    publicPath: project.get('publicUrl'),
    filename: '[name].[hash].js',
    path: project.get('paths.output'),
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
          parser: PostCSSSafeParser,
          map: { inline: false, annotation: true }
        }
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: project.get('paths.template'),
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
    new CleanWebpackPlugin(),
    project.get('generateSW') &&
      new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        exclude: [/\.map$/, /asset-manifest\.json$/],
        importWorkboxFrom: 'cdn',
        navigateFallback:
          project.get('publicUrl').replace(/(^\.)?\/$/, '') + '/index.html',
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
