import log from 'loglevel';

log.setLevel('info');

/* const logger = {
    info: (source, message, data) => {console.log(`INFO [${source}]: ${message}`, data)},
    error: (source, message, error) => {console.error(`ERROR [${source}]: ${message}`, error)},
    warn: (source, message, warn) => {console.warn(`WARN [${source}]: ${message}`, warn)},
    debug: (source, message, debug) =>{ console.debug(`DEBUG [${source}]: ${message}`, debug)}
};
 */

const logger = {
    info: (message) => log.info(message),
    warn: (message) => log.warn(message),
    error: (message) => log.error(message),
    debug: (message) => log.debug(message),
  };

export default logger;