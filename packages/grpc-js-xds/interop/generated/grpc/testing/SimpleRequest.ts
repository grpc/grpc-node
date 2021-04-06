// Original file: proto/grpc/testing/messages.proto

import type { PayloadType as _grpc_testing_PayloadType } from '../../grpc/testing/PayloadType';
import type { Payload as _grpc_testing_Payload, Payload__Output as _grpc_testing_Payload__Output } from '../../grpc/testing/Payload';
import type { BoolValue as _grpc_testing_BoolValue, BoolValue__Output as _grpc_testing_BoolValue__Output } from '../../grpc/testing/BoolValue';
import type { EchoStatus as _grpc_testing_EchoStatus, EchoStatus__Output as _grpc_testing_EchoStatus__Output } from '../../grpc/testing/EchoStatus';

/**
 * Unary request.
 */
export interface SimpleRequest {
  /**
   * Desired payload type in the response from the server.
   * If response_type is RANDOM, server randomly chooses one from other formats.
   */
  'response_type'?: (_grpc_testing_PayloadType | keyof typeof _grpc_testing_PayloadType);
  /**
   * Desired payload size in the response from the server.
   */
  'response_size'?: (number);
  /**
   * Optional input payload sent along with the request.
   */
  'payload'?: (_grpc_testing_Payload);
  /**
   * Whether SimpleResponse should include username.
   */
  'fill_username'?: (boolean);
  /**
   * Whether SimpleResponse should include OAuth scope.
   */
  'fill_oauth_scope'?: (boolean);
  /**
   * Whether to request the server to compress the response. This field is
   * "nullable" in order to interoperate seamlessly with clients not able to
   * implement the full compression tests by introspecting the call to verify
   * the response's compression status.
   */
  'response_compressed'?: (_grpc_testing_BoolValue);
  /**
   * Whether server should return a given status
   */
  'response_status'?: (_grpc_testing_EchoStatus);
  /**
   * Whether the server should expect this request to be compressed.
   */
  'expect_compressed'?: (_grpc_testing_BoolValue);
  /**
   * Whether SimpleResponse should include server_id.
   */
  'fill_server_id'?: (boolean);
  /**
   * Whether SimpleResponse should include grpclb_route_type.
   */
  'fill_grpclb_route_type'?: (boolean);
}

/**
 * Unary request.
 */
export interface SimpleRequest__Output {
  /**
   * Desired payload type in the response from the server.
   * If response_type is RANDOM, server randomly chooses one from other formats.
   */
  'response_type': (keyof typeof _grpc_testing_PayloadType);
  /**
   * Desired payload size in the response from the server.
   */
  'response_size': (number);
  /**
   * Optional input payload sent along with the request.
   */
  'payload'?: (_grpc_testing_Payload__Output);
  /**
   * Whether SimpleResponse should include username.
   */
  'fill_username': (boolean);
  /**
   * Whether SimpleResponse should include OAuth scope.
   */
  'fill_oauth_scope': (boolean);
  /**
   * Whether to request the server to compress the response. This field is
   * "nullable" in order to interoperate seamlessly with clients not able to
   * implement the full compression tests by introspecting the call to verify
   * the response's compression status.
   */
  'response_compressed'?: (_grpc_testing_BoolValue__Output);
  /**
   * Whether server should return a given status
   */
  'response_status'?: (_grpc_testing_EchoStatus__Output);
  /**
   * Whether the server should expect this request to be compressed.
   */
  'expect_compressed'?: (_grpc_testing_BoolValue__Output);
  /**
   * Whether SimpleResponse should include server_id.
   */
  'fill_server_id': (boolean);
  /**
   * Whether SimpleResponse should include grpclb_route_type.
   */
  'fill_grpclb_route_type': (boolean);
}
