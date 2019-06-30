const path = require('path');
const { default: create } = require('@riseup/library');
const pkg = require('./package.json');

module.exports = create({
  // Whether it is a monorepo child project
  monorepo: true,
  // Enables typescript and declaration files
  typescript: true,
  // Paths used on build
  paths: {
    root: __dirname,
    docs: path.join(__dirname, '../../docs/', pkg.name),
    build: path.join(__dirname, 'pkg')
  },
  // Source code aliases
  assign: {
    alias: { '~': './src' },
    todo: ['xxx', 'fixme', 'todo', 'refactor']
  },
  version: {
    // Build project on version bump. Boolean.
    build: true,
    // Generate docs from TS on version bump. Boolean.
    docs: false
  },
  extend: {
    babel: {
      strategy: 'deep',
      configure: {}
    },
    eslint: {
      strategy: 'deep',
      configure: {
        overrides: [
          {
            files: ['*'],
            rules: {
              // 'rule-name': 0
            }
          }
        ]
      }
    },
    jest: {
      strategy: 'deep',
      configure: {
        modulePathIgnorePatterns: []
      }
    },
    typedoc: {
      strategy: 'deep',
      configure: {
        exclude: ['**/__mocks__/**/*']
      }
    }
  }
});
