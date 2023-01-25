// Original file: proto/grpc/testing/echo_messages.proto

import type { Long } from '@grpc/proto-loader';

export interface ResponseParams {
  'request_deadline'?: (number | string | Long);
  'host'?: (string);
  'peer'?: (string);
}

export interface ResponseParams__Output {
  'request_deadline': (string);
  'host': (string);
  'peer': (string);
}
