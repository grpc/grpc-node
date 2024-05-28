// Original file: proto/grpc/testing/messages.proto

import type { Payload as _grpc_testing_Payload, Payload__Output as _grpc_testing_Payload__Output } from '../../grpc/testing/Payload';
import type { BoolValue as _grpc_testing_BoolValue, BoolValue__Output as _grpc_testing_BoolValue__Output } from '../../grpc/testing/BoolValue';

/**
 * Client-streaming request.
 */
export interface StreamingInputCallRequest {
  /**
   * Optional input payload sent along with the request.
   */
  'payload'?: (_grpc_testing_Payload | null);
  /**
   * Whether the server should expect this request to be compressed. This field
   * is "nullable" in order to interoperate seamlessly with servers not able to
   * implement the full compression tests by introspecting the call to verify
   * the request's compression status.
   */
  'expect_compressed'?: (_grpc_testing_BoolValue | null);
}

/**
 * Client-streaming request.
 */
export interface StreamingInputCallRequest__Output {
  /**
   * Optional input payload sent along with the request.
   */
  'payload': (_grpc_testing_Payload__Output | null);
  /**
   * Whether the server should expect this request to be compressed. This field
   * is "nullable" in order to interoperate seamlessly with servers not able to
   * implement the full compression tests by introspecting the call to verify
   * the request's compression status.
   */
  'expect_compressed': (_grpc_testing_BoolValue__Output | null);
}
