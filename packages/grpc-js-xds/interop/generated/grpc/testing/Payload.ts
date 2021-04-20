// Original file: proto/grpc/testing/messages.proto

import type { PayloadType as _grpc_testing_PayloadType } from '../../grpc/testing/PayloadType';

/**
 * A block of data, to simply increase gRPC message size.
 */
export interface Payload {
  /**
   * The type of data in body.
   */
  'type'?: (_grpc_testing_PayloadType | keyof typeof _grpc_testing_PayloadType);
  /**
   * Primary contents of payload.
   */
  'body'?: (Buffer | Uint8Array | string);
}

/**
 * A block of data, to simply increase gRPC message size.
 */
export interface Payload__Output {
  /**
   * The type of data in body.
   */
  'type': (keyof typeof _grpc_testing_PayloadType);
  /**
   * Primary contents of payload.
   */
  'body': (Buffer);
}
