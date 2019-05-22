const project = require('./project.config');

module.exports = {
  presets: [
    ['react-app', { typescript: project.get('typescript') }],
    '@emotion/babel-preset-css-prop'
  ].filter(Boolean),
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
  ],
  ignore: ['**/*.d.ts']
};
