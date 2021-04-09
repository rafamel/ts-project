export const defaults = {
  global: {
    root: process.cwd()
  },
  build: {
    pack: false,
    assets: [],
    multitarget: true,
    destination: 'pkg/'
  },
  transpile: {
    output: 'dist/'
  },
  release: {
    publish: true
  },
  docs: {
    build: true,
    destination: 'docs/',
    overrides: {}
  }
};
