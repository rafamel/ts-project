import logger from 'loglevel';
import config from '~/config';

// Set up logger
logger.setLevel(config.logger);

// Check all config values are defined; log environment
const objRecursive = (obj) => {
  if (typeof obj !== 'object') return;
  const keys = Object.keys(obj);
  if (!keys.length) return;

  keys.forEach((key) => {
    const value = obj[key];
    if (value === undefined) logger.warn(`Undefined config key '${key}'`);
    return objRecursive(value);
  });
};
logger.info(
  config.env.production ? 'Running on production' : 'Not running on production'
);
objRecursive(config);

export default logger;
