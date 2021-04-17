import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    pika: require.resolve('@pika/pack/dist-node/index.bin'),
    typedoc: getBin('typedoc', 'typedoc', __dirname)
  },
  pika: {
    transpile: require.resolve('./configure/pika/plugin-transpile'),
    manifest: require.resolve('./configure/pika/plugin-manifest'),
    assets: require.resolve('@pika/plugin-copy-assets'),
    standard: require.resolve('@pika/plugin-standard-pkg'),
    web: require.resolve('@pika/plugin-build-web')
  }
};
