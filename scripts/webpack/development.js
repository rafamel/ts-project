const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const project = require('../../project.config');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: Object.assign(
    {
      contentBase: project.get('paths.output'),
      compress: true,
      hot: true,
      disableHostCheck: true,
      historyApiFallback: true
    },
    project.get('dev')
  ),
  performance: { hints: false },
  output: {
    publicPath: project.get('publicUrl'),
    filename: '[name].js',
    path: project.get('paths.output'),
    chunkFilename: '[name].chunk.js',
    pathinfo: true // adds filename comments for require()
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: project.get('paths.template'),
      inject: true
    }),
    // Hot Updates for CSS (currently only CSS)
    new webpack.HotModuleReplacementPlugin(),
    // Watches new dependencies installs so the server
    // doesn't have to restart
    new WatchMissingNodeModulesPlugin('node_modules')
  ]
};
