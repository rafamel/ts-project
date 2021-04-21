const { run, series, finalize, remove, write } = require('kpo');
const fs = require('fs');
const tmpPath = require('./tmp-path');

module.exports = function tmpTask(object, cb) {
  return async (ctx) => {
    const filepath = tmpPath(null, '.json');

    ctx.cancellation.then(() => {
      try {
        fs.unlinkSync(filepath);
      } catch (_) {}
    });

    return run(
      ctx,
      finalize(
        series(write(filepath, object), await cb(filepath)),
        remove(filepath, { glob: false, strict: false })
      )
    );
  };
};
