import { paths } from './paths';

export const defaults = {
  lintmd: {
    include: './',
    exclude: './{node_modules,pkg,build,dist}/**',
    overrides: {}
  },
  commit: {
    path: paths.commitizen.conventionalChangelog.root
  }
};
