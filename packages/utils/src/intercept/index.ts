import path from 'path';
import { Empty } from 'type-core';
import { create, exec, ExecOptions, Task } from 'kpo';
import { constants } from '../constants';

export interface InterceptPair {
  original: string;
  replacement: string;
}

export function intercept(
  pairs: InterceptPair | InterceptPair[],
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
          [constants.interceptor.env]: JSON.stringify(
            (Array.isArray(pairs) ? pairs : [pairs]).map((pair) => ({
              original: path.resolve(ctx.cwd, pair.original),
              replacement: path.resolve(ctx.cwd, pair.replacement)
            }))
          )
        }
      }
    );
  });
}
