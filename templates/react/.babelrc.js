module.exports = {
  presets: ['react-app'],
  plugins: [
    [
      'babel-plugin-module-resolver',
      {
        alias: {
          '~': './src',
          '@static': './public/static'
        }
      }
    ],
    '@babel/plugin-syntax-import-meta'
  ]
};
