// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { EchoResponse as _google_showcase_v1beta1_EchoResponse, EchoResponse__Output as _google_showcase_v1beta1_EchoResponse__Output } from '../../../google/showcase/v1beta1/EchoResponse';

export interface PagedExpandResponse {
  'responses'?: (_google_showcase_v1beta1_EchoResponse)[];
  'next_page_token'?: (string);
}

export interface PagedExpandResponse__Output {
  'responses': (_google_showcase_v1beta1_EchoResponse__Output)[];
  'next_page_token': (string);
}
