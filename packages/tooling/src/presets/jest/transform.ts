import bj from 'babel-jest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = bj.createTransformer(require('../../configure/babel'));
