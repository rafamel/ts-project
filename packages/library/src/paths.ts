export const paths = {
  pika: {
    transpile: require.resolve('./configure/pika/plugin-transpile'),
    assets: require.resolve('@pika/plugin-copy-assets'),
    standard: require.resolve('@pika/plugin-standard-pkg'),
    web: require.resolve('@pika/plugin-build-web')
  }
};
