// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat {
  'proper_case_words'?: (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords);
  'header_format'?: "proper_case_words";
}

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat__Output {
  'proper_case_words'?: (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords__Output);
  'header_format': "proper_case_words";
}

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords {
}

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords__Output {
}

export interface Http1ProtocolOptions {
  'allow_absolute_url'?: (_google_protobuf_BoolValue);
  'accept_http_10'?: (boolean);
  'default_host_for_http_10'?: (string);
  'header_key_format'?: (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat);
  'enable_trailers'?: (boolean);
}

export interface Http1ProtocolOptions__Output {
  'allow_absolute_url': (_google_protobuf_BoolValue__Output);
  'accept_http_10': (boolean);
  'default_host_for_http_10': (string);
  'header_key_format': (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat__Output);
  'enable_trailers': (boolean);
}
