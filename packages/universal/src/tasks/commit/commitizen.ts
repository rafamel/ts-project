#!/usr/bin/env node

import { ensure } from 'ensurism';
import { bootstrap } from 'commitizen/dist/cli/git-cz';
import { paths } from '../../paths';

process.on('uncaughtException', (err) => {
  // eslint-disable-next-line no-console
  console.error(err.message || err);
  process.exit(1);
});

bootstrap({
  cliPath: paths.commitizen.root,
  // Force cz-conventional-changelog
  config: JSON.parse(
    ensure(process.env.COMMITIZEN_CONFIG, { type: 'string' }, { assert: true })
  )
});
