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
  docs: {
    overrides: {}
  }
};
