// Original file: proto/grpc/testing/echo_messages.proto

import type { RequestParams as _grpc_testing_RequestParams, RequestParams__Output as _grpc_testing_RequestParams__Output } from '../../grpc/testing/RequestParams';

export interface EchoRequest {
  'message'?: (string);
  'param'?: (_grpc_testing_RequestParams | null);
}

export interface EchoRequest__Output {
  'message': (string);
  'param': (_grpc_testing_RequestParams__Output | null);
}
