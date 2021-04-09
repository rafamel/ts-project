import { paths } from './paths';

export const defaults = {
  global: {
    root: process.cwd()
  },
  lintmd: {
    include: './',
    exclude: './{node_modules,pkg,build,dist}/**',
    overrides: {}
  },
  commit: {
    path: paths.commitizen.path
  },
  release: {
    publish: false,
    conventional: {
      active: true,
      preset: 'angular',
      changelog: {
        file: 'CHANGELOG.md',
        append: false,
        releaseCount: undefined,
        skipUnstable: false
      }
    },
    overrides: {}
  }
};
