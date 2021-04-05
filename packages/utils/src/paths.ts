import os from 'os';
import path from 'path';

export const paths = {
  bin: {
    node: process.execPath
  },
  riseup: {
    tmp: path.resolve(os.tmpdir(), 'riseup'),
    interceptor: require.resolve('./intercept/interceptor')
  }
};
