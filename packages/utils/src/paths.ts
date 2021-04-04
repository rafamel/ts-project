import os from 'os';
import path from 'path';

export const paths = {
  riseup: {
    tmp: path.resolve(os.tmpdir(), 'riseup')
  }
};
