import fs from 'fs';
import os from 'os';
import path from 'path';
import { into } from 'pipettes';

export const paths = {
  bin: {
    node: process.execPath
  },
  riseup: {
    tmp: path.resolve(os.tmpdir(), 'riseup'),
    interceptor: require.resolve('./intercept/interceptor')
  }
};

export const constants = {
  tmp: paths.riseup.tmp,
  bin: {
    node: paths.bin.node,
    npm: into(path.resolve(path.dirname(process.execPath), 'npm'), (npm) => {
      try {
        fs.accessSync(npm, fs.constants.F_OK);
        return npm;
      } catch (_) {
        return 'npm';
      }
    })
  }
};
