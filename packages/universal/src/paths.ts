import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    markdownlint: getBin('markdownlint-cli', 'markdownlint'),
    commitizen: require.resolve('./tasks/commit/commitizen'),
    changelog: getBin('conventional-changelog-cli', 'conventional-changelog')
  },
  commitizen: {
    root: path.resolve(require.resolve('commitizen/package.json'), '../'),
    conventionalChangelog: {
      root: path.resolve(
        require.resolve('cz-conventional-changelog/package.json'),
        '../'
      )
    }
  }
};
