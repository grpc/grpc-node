// Original file: proto/grpc/testing/messages.proto

import type { Payload as _grpc_testing_Payload, Payload__Output as _grpc_testing_Payload__Output } from '../../grpc/testing/Payload';

/**
 * Server-streaming response, as configured by the request and parameters.
 */
export interface StreamingOutputCallResponse {
  /**
   * Payload to increase response size.
   */
  'payload'?: (_grpc_testing_Payload);
}

/**
 * Server-streaming response, as configured by the request and parameters.
 */
export interface StreamingOutputCallResponse__Output {
  /**
   * Payload to increase response size.
   */
  'payload'?: (_grpc_testing_Payload__Output);
}
