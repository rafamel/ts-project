const paths = require('../paths');

module.exports = function babel(data) {
  const esnext = !data.args.targets.node && data.args.targets.esmodules;

  return {
    presets: [
      [
        paths.babel.presetEnv,
        esnext
          ? {
              modules: false,
              spec: true,
              targets: data.args.targets
            }
          : {
              targets: data.args.targets
            }
      ],
      paths.babel.presetTypeScript
    ],
    plugins: [
      [
        paths.babel.pluginModuleResolver,
        {
          alias: data.options.alias || {}
        }
      ]
    ]
  };
};
