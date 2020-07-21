// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { Severity as _google_showcase_v1beta1_Severity } from '../../../google/showcase/v1beta1/Severity';

export interface EchoResponse {
  'content'?: (string);
  'severity'?: (_google_showcase_v1beta1_Severity | keyof typeof _google_showcase_v1beta1_Severity);
}

export interface EchoResponse__Output {
  'content': (string);
  'severity': (keyof typeof _google_showcase_v1beta1_Severity);
}
