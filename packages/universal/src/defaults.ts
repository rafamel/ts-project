import { paths } from './paths';

export const defaults = {
  lintmd: {
    include: './',
    exclude: './{node_modules,pkg,build,dist}/**',
    overrides: {}
  },
  commit: {
    path: paths.commitizen.conventionalChangelog.root
  },
  semantic: {
    preset: 'angular'
  },
  changelog: {
    preset: 'angular',
    infile: 'CHANGELOG.md',
    outfile: 'CHANGELOG.md',
    append: false,
    releaseCount: undefined,
    skipUnstable: false
  }
};
