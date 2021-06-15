import os from 'os';
import path from 'path';

export const constants = {
  tmp: path.resolve(os.tmpdir(), 'riseup'),
  node: process.execPath,
  interceptor: {
    path: require.resolve('./intercept/interceptor'),
    env: 'RISEUP_INCERCEPT_PAIRS'
  }
};
