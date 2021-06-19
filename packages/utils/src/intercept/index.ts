import path from 'path';
import { Empty } from 'type-core';
import { create, exec, ExecOptions, log, series, Task } from 'kpo';
import { constants } from '../constants';

export interface InterceptFile {
  path: string;
  content: string;
  require: null | 'js' | 'json';
}

export function intercept(
  files: InterceptFile | InterceptFile[],
  script: string,
  args?: string[] | Empty,
  options?: ExecOptions | Empty
): Task.Async {
  return create((ctx) => {
    const arr = Array.isArray(files) ? files : [files];
    return series(
      log(
        'debug',
        'Files intercepted: ' + arr.map((file) => file.path).join(', ')
      ),
      exec(
        constants.node,
        ['-r', constants.interceptor.path, script, ...(args || [])],
        {
          ...Object.assign({}, options || undefined),
          env: {
            ...((options && options.env) || undefined),
            [constants.interceptor.env]: JSON.stringify(
              arr.map((file) => ({
                path: path.resolve(ctx.cwd, file.path),
                content: file.content,
                require: file.require
              }))
            )
          }
        }
      )
    );
  });
}
