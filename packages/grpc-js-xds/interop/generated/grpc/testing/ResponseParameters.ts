// Original file: proto/grpc/testing/messages.proto

import type { BoolValue as _grpc_testing_BoolValue, BoolValue__Output as _grpc_testing_BoolValue__Output } from '../../grpc/testing/BoolValue';

/**
 * Configuration for a particular response.
 */
export interface ResponseParameters {
  /**
   * Desired payload sizes in responses from the server.
   */
  'size'?: (number);
  /**
   * Desired interval between consecutive responses in the response stream in
   * microseconds.
   */
  'interval_us'?: (number);
  /**
   * Whether to request the server to compress the response. This field is
   * "nullable" in order to interoperate seamlessly with clients not able to
   * implement the full compression tests by introspecting the call to verify
   * the response's compression status.
   */
  'compressed'?: (_grpc_testing_BoolValue);
}

/**
 * Configuration for a particular response.
 */
export interface ResponseParameters__Output {
  /**
   * Desired payload sizes in responses from the server.
   */
  'size': (number);
  /**
   * Desired interval between consecutive responses in the response stream in
   * microseconds.
   */
  'interval_us': (number);
  /**
   * Whether to request the server to compress the response. This field is
   * "nullable" in order to interoperate seamlessly with clients not able to
   * implement the full compression tests by introspecting the call to verify
   * the response's compression status.
   */
  'compressed'?: (_grpc_testing_BoolValue__Output);
}
