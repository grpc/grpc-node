import * as assert from 'assert';

import * as grpc from '../src';
import * as logging from '../src/logging';

describe('Logging', () => {
  afterEach(() => {
    // Ensure that the logger is restored to its defaults after each test.
    grpc.setLogger(console);
    grpc.setLogVerbosity(grpc.logVerbosity.DEBUG);
  });

  it('logger defaults to console', () => {
    assert.strictEqual(logging.getLogger(), console);
  });

  it('sets the logger to a new value', () => {
    const logger: Partial<Console> = {};

    logging.setLogger(logger);
    assert.strictEqual(logging.getLogger(), logger);
  });

  it('gates logging based on severity', () => {
    const output: Array<string|string[]> = [];
    const logger: Partial<Console> = {
      error(...args: string[]): void {
        output.push(args);
      }
    };

    logging.setLogger(logger);

    // The default verbosity (DEBUG) should log everything.
    logging.log(grpc.logVerbosity.DEBUG, 'a', 'b', 'c');
    logging.log(grpc.logVerbosity.INFO, 'd', 'e');
    logging.log(grpc.logVerbosity.ERROR, 'f');

    // The INFO verbosity should not log DEBUG data.
    logging.setLoggerVerbosity(grpc.logVerbosity.INFO);
    logging.log(grpc.logVerbosity.DEBUG, 1, 2, 3);
    logging.log(grpc.logVerbosity.INFO, 'g');
    logging.log(grpc.logVerbosity.ERROR, 'h', 'i');

    // The ERROR verbosity should not log DEBUG or INFO data.
    logging.setLoggerVerbosity(grpc.logVerbosity.ERROR);
    logging.log(grpc.logVerbosity.DEBUG, 4, 5, 6);
    logging.log(grpc.logVerbosity.INFO, 7, 8);
    logging.log(grpc.logVerbosity.ERROR, 'j', 'k');

    assert.deepStrictEqual(
        output,
        [['a', 'b', 'c'], ['d', 'e'], ['f'], ['g'], ['h', 'i'], ['j', 'k']]);
  });
});
