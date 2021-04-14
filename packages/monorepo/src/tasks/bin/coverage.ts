import { create, run, log, exec } from 'kpo';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { constants } from '@riseup/utils';
import { paths } from '../../paths';

run(
  create((ctx) => {
    const infile = ctx.args[0];
    const outdir = ctx.args[1];
    const tempfile = path.join(outdir, uuid() + '.info');
    return exec(constants.node, [paths.bin.lcovResultMerger, infile, tempfile]);
  }),
  {
    cwd: process.cwd(),
    args: process.argv.slice(2)
  }
).catch((err) => {
  return Promise.resolve()
    .then(() => run(log('error', err.message)))
    .finally(() => process.exit(1));
});
