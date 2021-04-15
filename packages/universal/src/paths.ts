import path from 'path';
import { getBin } from '@riseup/utils';

export const paths = {
  bin: {
    lerna: getBin('lerna', 'lerna', __dirname),
    changelog: getBin(
      'conventional-changelog-cli',
      'conventional-changelog',
      __dirname
    ),
    commitizen: require.resolve('./tasks/commit/commitizen'),
    markdownlint: getBin('markdownlint-cli', 'markdownlint', __dirname)
  },
  commitizen: {
    root: path.resolve(require.resolve('commitizen/package.json'), '../'),
    path: path.resolve(
      require.resolve('cz-conventional-changelog/package.json'),
      '../'
    )
  }
};
