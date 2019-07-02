module.exports = {
  from: 'react',
  pipe: {
    'package.json': (pkg) => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        tailwindcss: '^1.0.3'
      }
    }),
    'craco.config.js': (src) => {
      assert(src.includes(`require('postcss-functions')`));

      return src.replace(
        `require('postcss-functions')`,
        `require('tailwindcss')('./tailwind.config.js'),\n` +
          `        require('postcss-functions')`
      );
    }
  }
};
