import { NullaryFn, UnaryFn } from 'type-core';
import { finalize, create, log, series, Task } from 'kpo';
import path from 'path';
import fs from 'fs';
import { tmpPath } from '../tmp-path';

export interface TemporalFile {
  ext: string;
  content: string;
  overrides: string[];
}

export function temporal(
  files: TemporalFile | TemporalFile[],
  cb: UnaryFn<string[], Task | Promise<Task>>
): Task.Async {
  return create(async (ctx) => {
    const arr = Array.isArray(files) ? files : [files];
    const response = await Promise.all(
      arr.map((file) => getFile(ctx.cwd, file))
    );

    let teardown = async (): Promise<void> => {
      teardown = () => Promise.resolve();
      await Promise.all(response.map(([_, teardown]) => teardown()));
    };

    ctx.cancellation.then(() => teardown());

    const selection = response.map(([file]) => file);
    return finalize(
      series(
        log('debug', 'Files selected: ' + selection.join(', ')),
        await cb(selection)
      ),
      create(() => teardown())
    );
  });
}

async function getFile(
  cwd: string,
  file: TemporalFile
): Promise<[string, NullaryFn<Promise<void>>]> {
  for (const override of file.overrides) {
    const fullPath = path.resolve(cwd, override);
    const exists = await new Promise<boolean>((resolve) => {
      fs.access(fullPath, fs.constants.F_OK, (err) => resolve(!err));
    });
    if (exists) return [fullPath, () => Promise.resolve()];
  }

  const tmpFilePath = tmpPath(file.ext, null);
  await new Promise<void>((resolve, reject) => {
    fs.writeFile(tmpFilePath, file.content, (err) => {
      err ? reject(err) : resolve();
    });
  });
  return [
    tmpFilePath,
    () => {
      return new Promise<void>((resolve) => {
        fs.unlink(tmpFilePath, () => resolve());
      });
    }
  ];
}
