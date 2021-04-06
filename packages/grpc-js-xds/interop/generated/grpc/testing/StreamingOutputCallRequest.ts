// Original file: proto/grpc/testing/messages.proto

import type { PayloadType as _grpc_testing_PayloadType } from '../../grpc/testing/PayloadType';
import type { ResponseParameters as _grpc_testing_ResponseParameters, ResponseParameters__Output as _grpc_testing_ResponseParameters__Output } from '../../grpc/testing/ResponseParameters';
import type { Payload as _grpc_testing_Payload, Payload__Output as _grpc_testing_Payload__Output } from '../../grpc/testing/Payload';
import type { EchoStatus as _grpc_testing_EchoStatus, EchoStatus__Output as _grpc_testing_EchoStatus__Output } from '../../grpc/testing/EchoStatus';

/**
 * Server-streaming request.
 */
export interface StreamingOutputCallRequest {
  /**
   * Desired payload type in the response from the server.
   * If response_type is RANDOM, the payload from each response in the stream
   * might be of different types. This is to simulate a mixed type of payload
   * stream.
   */
  'response_type'?: (_grpc_testing_PayloadType | keyof typeof _grpc_testing_PayloadType);
  /**
   * Configuration for each expected response message.
   */
  'response_parameters'?: (_grpc_testing_ResponseParameters)[];
  /**
   * Optional input payload sent along with the request.
   */
  'payload'?: (_grpc_testing_Payload);
  /**
   * Whether server should return a given status
   */
  'response_status'?: (_grpc_testing_EchoStatus);
}

/**
 * Server-streaming request.
 */
export interface StreamingOutputCallRequest__Output {
  /**
   * Desired payload type in the response from the server.
   * If response_type is RANDOM, the payload from each response in the stream
   * might be of different types. This is to simulate a mixed type of payload
   * stream.
   */
  'response_type': (keyof typeof _grpc_testing_PayloadType);
  /**
   * Configuration for each expected response message.
   */
  'response_parameters': (_grpc_testing_ResponseParameters__Output)[];
  /**
   * Optional input payload sent along with the request.
   */
  'payload'?: (_grpc_testing_Payload__Output);
  /**
   * Whether server should return a given status
   */
  'response_status'?: (_grpc_testing_EchoStatus__Output);
}
