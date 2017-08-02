import * as stream from 'stream';
import { Status } from './constants';

/**
 * This class represents a duplex stream associated with a single gRPC call.
 */
export class CallStream extends stream.Duplex {
  /**
   * Cancels the call associated with this stream with a given status.
   */
  cancelWithStatus(status: Status) {
    throw new Error();
  }
}
