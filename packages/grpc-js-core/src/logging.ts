import {LogVerbosity} from './constants';

let _logger: Partial<Console> = console;
let _logVerbosity: LogVerbosity = LogVerbosity.DEBUG;

export const getLogger = (): Partial<Console> => {
  return _logger;
};

export const setLogger = (logger: Partial<Console>): void => {
  _logger = logger;
};

export const setLoggerVerbosity = (verbosity: LogVerbosity): void => {
  _logVerbosity = verbosity;
};

export const log = (severity: LogVerbosity, ...args: any[]): void => {
  if (severity >= _logVerbosity && typeof _logger.error === 'function') {
    _logger.error(...args);
  }
};
