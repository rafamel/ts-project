import logger from 'loglevel';
import config from '~/config';

// Set up logger
logger.setLevel(config.get('logger'));

export default logger;
