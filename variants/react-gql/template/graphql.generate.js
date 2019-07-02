const { config } = require('dotenv');
const { envs } = require('slimconf');

config();
module.exports = {
  overwrite: true,
  schema: [
    {
      [envs.get('REACT_APP_GRAPHQL_ENDPOINT')]: {
        headers: {}
      }
    }
  ],
  documents: './src/**/*.{ts,tsx,graphql}',
  generates: {
    './src/lib/types.ts': {
      plugins: [
        { add: '/* eslint-disable */' },
        'typescript',
        'typescript-operations'
      ],
      config: { withComponent: false, withHooks: false }
    }
  },
  pluckConfig: {
    modules: [
      { name: 'graphql-tag', identifier: 'gql' },
      { name: '~/utils', identifier: 'gql' }
    ]
  }
};
