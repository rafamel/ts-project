import { Empty, Deep } from 'type-core';
import { shallow } from 'merge-strategies';
import {
  Task,
  remove,
  progress,
  context,
  mkdir,
  series,
  create,
  finalize,
  exec
} from 'kpo';
import { v4 as uuid } from 'uuid';
import path from 'path';
import { constants } from '@riseup/utils';
import { paths } from '../paths';
import { defaults } from '../defaults';

export interface CoverageParams {
  /** Relative to each package. Can be a glob. */
  infile?: string;
  /** Relative to the monorepo root. */
  outfile?: string;
}

export type CoverageOptions = CoverageParams;

export function hydrateCoverage(
  options: CoverageOptions | Empty
): Deep.Required<CoverageOptions> {
  return shallow(
    {
      infile: defaults.coverage.infile,
      outfile: defaults.coverage.outfile
    },
    options || undefined
  );
}

export function coverage(options: CoverageOptions | Empty): Task.Async {
  const opts = hydrateCoverage(options);

  return create((ctx) => {
    const infile = opts.infile;
    const outfile = path.resolve(ctx.cwd, opts.outfile);
    const outdir = path.dirname(outfile);
    const tempdir = path.join(constants.tmp, uuid());

    const task = finalize(
      series(
        mkdir(tempdir, { ensure: true }),
        mkdir(outdir, { ensure: true }),
        remove(outfile, { glob: false, strict: false, recursive: false }),
        exec(constants.node, [
          paths.bin.lerna,
          'exec',
          constants.node,
          paths.bin.coverage,
          '--',
          infile,
          tempdir
        ]),
        exec(constants.node, [
          paths.bin.lcovResultMerger,
          path.join(tempdir, '*.info'),
          outfile
        ])
      ),
      remove(tempdir, { glob: false, strict: false, recursive: true })
    );

    return progress(
      { message: 'Compile coverage' },
      context({ args: [] }, task)
    );
  });
}
