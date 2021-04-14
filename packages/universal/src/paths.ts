import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    lerna: getBin('lerna', 'lerna'),
    changelog: getBin('conventional-changelog-cli', 'conventional-changelog'),
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
