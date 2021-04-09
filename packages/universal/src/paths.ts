import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    releaseit: getBin('release-it', 'release-it'),
    commitizen: require.resolve('./tasks/commit/commitizen'),
    markdownlint: getBin('markdownlint-cli', 'markdownlint')
  },
  commitizen: {
    root: path.resolve(require.resolve('commitizen/package.json'), '../'),
    path: path.resolve(
      require.resolve('cz-conventional-changelog/package.json'),
      '../'
    )
  }
};
