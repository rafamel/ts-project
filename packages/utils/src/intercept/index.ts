import path from 'path';
import { Empty } from 'type-core';
import { create, exec, ExecOptions, Task } from 'kpo';
import { constants } from '../constants';

export function intercept(
  files: { original: string; replacement: string },
  script: string,
  args?: string[] | Empty,
  options?: ExecOptions | Empty
): Task.Async {
  return create((ctx) => {
    return exec(
      constants.node,
      ['-r', constants.interceptor.path, script, ...(args || [])],
      {
        ...Object.assign({}, options || undefined),
        env: {
          ...((options && options.env) || undefined),
          [constants.interceptor.env.original]: path.resolve(
            ctx.cwd,
            files.original
          ),
          [constants.interceptor.env.replacement]: path.resolve(
            ctx.cwd,
            files.replacement
          )
        }
      }
    );
  });
}
