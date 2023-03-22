// Original file: proto/grpc/testing/echo_messages.proto

import type { ResponseParams as _grpc_testing_ResponseParams, ResponseParams__Output as _grpc_testing_ResponseParams__Output } from '../../grpc/testing/ResponseParams';

export interface EchoResponse {
  'message'?: (string);
  'param'?: (_grpc_testing_ResponseParams | null);
}

export interface EchoResponse__Output {
  'message': (string);
  'param': (_grpc_testing_ResponseParams__Output | null);
}
