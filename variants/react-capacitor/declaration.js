module.exports = {
  from: 'react',
  pipe: {
    'package.json': (pkg) => ({
      ...pkg,
      devDependencies: {
        ...pkg.devDependencies,
        '@ionic/lab': '^2.0.6',
        ionic: '^5.2.0',
        '@capacitor/cli': '1.1.1',
        '@capacitor/core': '^1.1.1'
      }
    }),
    'kpo.scripts.js': (src) => {
      src = src.trim();
      assert(src.slice(-2) === '};');

      return (
        src.slice(0, -2) +
        `,\n` +
        `  /* Start */\n` +
        `  start: 'kpo ionic:serve',\n` +
        `  'start:lab': 'ionic serve --lab --no-open',\n` +
        `  'start:dev': 'ionic serve --devapp --no-open',\n` +
        `  'ionic:serve': scripts.start\n` +
        `};\n`
      );
    }
  }
};
