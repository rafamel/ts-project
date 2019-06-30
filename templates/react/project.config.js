const path = require('path');
const fs = require('fs');
const { default: create } = require('@riseup/react');
const breakpoints = require('./breakpoints');

module.exports = create({
  // Whether it is a monorepo child project
  monorepo: false,
  // Enables typescript and declaration files
  typescript: true,
  // Directories/files to clean
  clean: ['build', 'deploy', 'coverage', 'docs', 'CHANGELOG.md'],
  // Paths used on build
  paths: {
    root: __dirname,
    docs: path.join(__dirname, 'docs')
  },
  version: {
    // Build project on version bump. Boolean.
    build: true,
    // Generate docs from TS on version bump. Boolean.
    docs: true
  },
  server: {
    serve: { port: '8080' },
    dev: { open: false }
  },
  assign: {
    // Emit linter warning for these strings
    todo: ['xxx', 'fixme', 'todo', 'refactor'],
    // Source code aliases
    alias: {
      '~': './src',
      '@static': './public/static'
    },
    env: {
      // Process environment variables
      process: {
        PUBLIC_URL: '/'
      },
      // Variables to be interpolated and made available on app.
      // They will be uppercase, decamelized, and prefixed by REACT_APP
      app: {
        ...breakpoints,
        ...JSON.parse(
          fs.readFileSync(path.join(__dirname, 'public/app.webmanifest'))
        )
      }
    }
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
        setupFilesAfterEnv: ['<rootDir>/jest.environment.js'],
        modulePathIgnorePatterns: [],
        transformIgnorePatterns: ['/node_modules/(?!(module-to-transpile)/)']
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
