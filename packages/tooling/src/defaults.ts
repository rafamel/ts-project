export const defaults = {
  global: {
    root: process.cwd(),
    alias: {},
    extensions: {
      js: ['js', 'jsx'],
      ts: ['ts', 'tsx']
    }
  },
  transpile: {
    types: true,
    output: 'dist/',
    targets: { node: '12.0.0' }
  },
  lint: {
    prettier: true,
    highlight: ['fixme', 'todo', 'refactor'],
    rules: {}
  }
};
