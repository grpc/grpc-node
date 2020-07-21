// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';

export interface ExpandRequest {
  'content'?: (string);
  'error'?: (_google_rpc_Status);
}

export interface ExpandRequest__Output {
  'content': (string);
  'error'?: (_google_rpc_Status__Output);
}
