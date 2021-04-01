const paths = require('../paths');

module.exports = function pika(data) {
  return [
    ...[
      [paths.pika.builderNode, data],
      [paths.pika.builderTypescript, data],
      ['@pika/plugin-copy-assets', { files: data.args.assets }]
    ],
    ...(data.args.nodeOnly
      ? []
      : [
          [
            '@pika/plugin-standard-pkg',
            { exclude: ['__mocks__/**/*', '__tests__/**/*'] }
          ],
          ['@pika/plugin-build-web']
        ])
  ];
};
