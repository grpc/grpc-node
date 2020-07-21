// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';
import { Severity as _google_showcase_v1beta1_Severity } from '../../../google/showcase/v1beta1/Severity';

export interface EchoRequest {
  'content'?: (string);
  'error'?: (_google_rpc_Status);
  'severity'?: (_google_showcase_v1beta1_Severity | keyof typeof _google_showcase_v1beta1_Severity);
  'response'?: "content"|"error";
}

export interface EchoRequest__Output {
  'content'?: (string);
  'error'?: (_google_rpc_Status__Output);
  'severity': (keyof typeof _google_showcase_v1beta1_Severity);
  'response': "content"|"error";
}
