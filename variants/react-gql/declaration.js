const assert = require('assert');

module.exports = {
  from: 'react',
  pipe: {
    'package.json': (pkg) => ({
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        dotenv: '^8.0.0',
        graphql: '^14.3.1',
        'graphql-tag': '^2.10.1',
        urql: '^1.0.5'
      },
      devDependencies: {
        ...pkg.devDependencies,
        '@graphql-codegen/add': '^1.2.0',
        '@graphql-codegen/cli': '^1.2.0',
        '@graphql-codegen/typescript': '^1.2.0',
        '@graphql-codegen/typescript-operations': '^1.2.0',
        '@types/graphql': '^14.2.0'
      }
    }),
    'kpo.scripts.js': (src) => {
      src = src.trim();
      assert(src.slice(-2) === '};');

      return (
        src.slice(0, -2) +
        `,\n` +
        `  /* GraphQL */\n` +
        `  'start:generate': kpo.parallel(['kpo watch', 'kpo generate -- --watch'])\n` +
        `  generate: 'graphql-codegen --config graphql.generate.js',\n` +
        `};\n`
      );
    },
    'src/utils/index.ts': (src) => {
      return `export { default as gql } from 'graphql-tag';\n` + src;
    },
    'src/config.ts': (src) => {
      assert(src.includes('process.env.REACT_APP_GRAPHQL_ENDPOINT'));
      return src.replace(
        'process.env.REACT_APP_GRAPHQL_ENDPOINT',
        `envs.get('REACT_APP_GRAPHQL_ENDPOINT')`
      );
    }
  }
};
