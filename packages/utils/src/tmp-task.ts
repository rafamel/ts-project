import { Serial, UnaryFn } from 'type-core';
import { series, finalize, remove, write, create, Task } from 'kpo';
import fs from 'fs';
import { tmpPath } from './tmp-path';

export function tmpTask(
  ext: string | null,
  object: Serial.Object | Serial.Array | string,
  cb: UnaryFn<string, Task | Promise<Task>>
): Task.Async {
  return create(async (ctx) => {
    const filepath = tmpPath(ext, null);

    ctx.cancellation.then(() => {
      try {
        fs.unlinkSync(filepath);
      } catch (_) {}
    });

    return finalize(
      series(write(filepath, object), await cb(filepath)),
      remove(filepath, { glob: false, strict: false })
    );
  });
}
