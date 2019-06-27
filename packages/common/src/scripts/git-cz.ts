#!/usr/bin/env node

import path from 'path';
import { bootstrap } from 'commitizen/dist/cli/git-cz';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error(err.message || err);
  process.exit(1);
});

bootstrap({
  cliPath: path.join(require.resolve('commitizen/package.json'), '../'),
  // Force cz-conventional-changelog
  config: { path: 'cz-conventional-changelog' }
});
