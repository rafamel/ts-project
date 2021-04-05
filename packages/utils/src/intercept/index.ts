import path from 'path';
import { Empty } from 'type-core';
import { create, exec, ExecOptions, Task } from 'kpo';
import { paths } from '../paths';

export function intercept(
  files: { original: string; replacement: string },
  script: string,
  args?: string[] | Empty,
  options?: ExecOptions | Empty
): Task.Async {
  return create((ctx) => {
    return exec(
      paths.bin.node,
      ['-r', paths.riseup.interceptor, script, ...(args || [])],
      {
        ...Object.assign({}, options || undefined),
        env: {
          ...((options && options.env) || undefined),
          RISEUP_INCERCEPT_ORIGINAL: path.resolve(ctx.cwd, files.original),
          RISEUP_INTERCEPT_REPLACEMENT: path.resolve(ctx.cwd, files.replacement)
        }
      }
    );
  });
}
