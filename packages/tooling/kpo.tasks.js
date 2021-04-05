const lint = require('../scripts/tasks/lint');
const test = require('../scripts/tasks/test');
const build = require('../scripts/tasks/build');
const eslint = require('../scripts/configure/eslint');
const jest = require('../scripts/configure/jest');
const pika = require('../scripts/configure/pika');
const babel = require('../scripts/configure/babel');
const typescript = require('../scripts/configure/typescript');

module.exports = {
  lint: lint.bind(null, {
    args: {
      paths: ['./src', './test']
    },
    options: {
      paths: {
        root: process.cwd()
      },
      extensions: {
        js: ['js', 'jsx'],
        ts: ['ts', 'tsx']
      }
    },
    config: {
      eslint: eslint({
        args: {
          prettier: true,
          todo: ['fixme', 'todo', 'refactor']
        },
        options: {
          extensions: {
            js: ['js', 'jsx'],
            ts: ['ts', 'tsx']
          },
          paths: {
            root: process.cwd(),
            alias: {}
          }
        }
      })
    }
  }),
  build: build.bind(null, {
    options: {
      paths: {
        root: process.cwd(),
        dest: './pkg'
      }
    },
    config: {
      pika: pika({
        args: {
          nodeOnly: true,
          assets: ['static/']
        },
        options: {
          paths: {
            root: process.cwd()
          },
          extensions: {
            js: ['js', 'jsx'],
            ts: ['ts', 'tsx']
          }
        },
        config: {
          babel: {
            node: babel({
              args: {
                targets: { node: '12.0.0' }
              },
              options: {
                alias: {}
              }
            })
          },
          typescript: typescript({
            options: {
              paths: {
                root: process.cwd()
              }
            }
          })
        }
      }),
      babel: {
        standard: babel({
          args: {
            targets: { esmodules: true }
          },
          options: {
            alias: {}
          }
        })
      }
    }
  }),
  test: test.bind(null, {
    options: {
      paths: {
        root: process.cwd()
      }
    },
    config: {
      jest: jest({
        options: {
          extensions: {
            js: ['js', 'jsx'],
            ts: ['ts', 'tsx']
          }
        },
        config: {
          babel: {
            node: babel({
              args: {
                targets: { node: '12.0.0' }
              },
              options: {
                alias: {}
              }
            })
          }
        }
      })
    }
  })
};
