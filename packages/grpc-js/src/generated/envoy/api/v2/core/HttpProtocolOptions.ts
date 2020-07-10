// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

export enum _envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction {
  ALLOW = 0,
  REJECT_REQUEST = 1,
  DROP_HEADER = 2,
}

export interface HttpProtocolOptions {
  'idle_timeout'?: (_google_protobuf_Duration);
  'max_headers_count'?: (_google_protobuf_UInt32Value);
  'max_connection_duration'?: (_google_protobuf_Duration);
  'max_stream_duration'?: (_google_protobuf_Duration);
  'headers_with_underscores_action'?: (_envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction | keyof typeof _envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction);
}

export interface HttpProtocolOptions__Output {
  'idle_timeout': (_google_protobuf_Duration__Output);
  'max_headers_count': (_google_protobuf_UInt32Value__Output);
  'max_connection_duration': (_google_protobuf_Duration__Output);
  'max_stream_duration': (_google_protobuf_Duration__Output);
  'headers_with_underscores_action': (keyof typeof _envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction);
}
