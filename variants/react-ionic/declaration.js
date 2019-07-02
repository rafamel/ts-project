module.exports = {
  from: 'react',
  pipe: {
    'package.json': (pkg) => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        '@ionic/core': '^4.6.0',
        '@ionic/react': '0.0.6-3',
        ionic: '^5.2.0',
        memoizee: '^0.4.14',
        'react-router': '^5.0.1',
        'react-router-dom': '^5.0.1'
      },
      devDependencies: {
        ...pkg.devDependencies,
        '@types/memoizee': '^0.4.2',
        '@capacitor/cli': '1.0.0',
        '@capacitor/core': '^1.0.0',
        '@types/react-router': '^5.0.1',
        '@types/react-router-dom': '^4.3.3',
        '@trust/webcrypto': '^0.9.2'
      }
    }),
    'kpo.scripts.js': (src) => {
      src = src.trim();
      assert(src.slice(-2) === '};');

      return (
        src.slice(0, -2) +
        `,\n` +
        `  start: 'kpo ionic:serve',\n` +
        `  build: 'kpo ionic:build',\n` +
        `  /* Ionic */\n` +
        `  'ionic:serve': scripts.start\n` +
        `  'ionic:build': scripts.build,\n` +
        `};\n`
      );
    },
    'project.config.js': (src) => {
      assert(src.includes(`module-to-transpile`));

      return src.replace(
        `module-to-transpile`,
        `module-to-transpile|@ionic|ionicons`
      );
    },
    'craco.config.js': (src) => {
      assert(src.includes(`const content = [`));
      return src.replace(
        `const content = [`,
        `const content = [\n  './node_modules/@ionic/core/css/ionic.bundle.css', `
      );
    },
    'src/styles/index.scss': (src) => {
      return `@import './ionic.scss';\n` + src;
    },
    'src/utils/index.ts': (src) => {
      return `export { default as platform } from './platform';\n` + src;
    },
    'src/index.ts': (src) => {
      return `/* Ionic */\n` + `import '@ionic/core';\n` + src;
    }
  }
};
