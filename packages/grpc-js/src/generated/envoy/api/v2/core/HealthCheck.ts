// Original file: deps/envoy-api/envoy/api/v2/core/health_check.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { EventServiceConfig as _envoy_api_v2_core_EventServiceConfig, EventServiceConfig__Output as _envoy_api_v2_core_EventServiceConfig__Output } from '../../../../envoy/api/v2/core/EventServiceConfig';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { Int64Range as _envoy_type_Int64Range, Int64Range__Output as _envoy_type_Int64Range__Output } from '../../../../envoy/type/Int64Range';
import { CodecClientType as _envoy_type_CodecClientType } from '../../../../envoy/type/CodecClientType';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';
import { Long } from '@grpc/proto-loader';

export interface _envoy_api_v2_core_HealthCheck_CustomHealthCheck {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface _envoy_api_v2_core_HealthCheck_CustomHealthCheck__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}

export interface _envoy_api_v2_core_HealthCheck_GrpcHealthCheck {
  'service_name'?: (string);
  'authority'?: (string);
}

export interface _envoy_api_v2_core_HealthCheck_GrpcHealthCheck__Output {
  'service_name': (string);
  'authority': (string);
}

export interface _envoy_api_v2_core_HealthCheck_HttpHealthCheck {
  'host'?: (string);
  'path'?: (string);
  'send'?: (_envoy_api_v2_core_HealthCheck_Payload);
  'receive'?: (_envoy_api_v2_core_HealthCheck_Payload);
  'service_name'?: (string);
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'request_headers_to_remove'?: (string)[];
  'use_http2'?: (boolean);
  'expected_statuses'?: (_envoy_type_Int64Range)[];
  'codec_client_type'?: (_envoy_type_CodecClientType | keyof typeof _envoy_type_CodecClientType);
  'service_name_matcher'?: (_envoy_type_matcher_StringMatcher);
}

export interface _envoy_api_v2_core_HealthCheck_HttpHealthCheck__Output {
  'host': (string);
  'path': (string);
  'send': (_envoy_api_v2_core_HealthCheck_Payload__Output);
  'receive': (_envoy_api_v2_core_HealthCheck_Payload__Output);
  'service_name': (string);
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'request_headers_to_remove': (string)[];
  'use_http2': (boolean);
  'expected_statuses': (_envoy_type_Int64Range__Output)[];
  'codec_client_type': (keyof typeof _envoy_type_CodecClientType);
  'service_name_matcher': (_envoy_type_matcher_StringMatcher__Output);
}

export interface _envoy_api_v2_core_HealthCheck_Payload {
  'text'?: (string);
  'binary'?: (Buffer | Uint8Array | string);
  'payload'?: "text"|"binary";
}

export interface _envoy_api_v2_core_HealthCheck_Payload__Output {
  'text'?: (string);
  'binary'?: (Buffer);
  'payload': "text"|"binary";
}

export interface _envoy_api_v2_core_HealthCheck_RedisHealthCheck {
  'key'?: (string);
}

export interface _envoy_api_v2_core_HealthCheck_RedisHealthCheck__Output {
  'key': (string);
}

export interface _envoy_api_v2_core_HealthCheck_TcpHealthCheck {
  'send'?: (_envoy_api_v2_core_HealthCheck_Payload);
  'receive'?: (_envoy_api_v2_core_HealthCheck_Payload)[];
}

export interface _envoy_api_v2_core_HealthCheck_TcpHealthCheck__Output {
  'send': (_envoy_api_v2_core_HealthCheck_Payload__Output);
  'receive': (_envoy_api_v2_core_HealthCheck_Payload__Output)[];
}

export interface _envoy_api_v2_core_HealthCheck_TlsOptions {
  'alpn_protocols'?: (string)[];
}

export interface _envoy_api_v2_core_HealthCheck_TlsOptions__Output {
  'alpn_protocols': (string)[];
}

export interface HealthCheck {
  'timeout'?: (_google_protobuf_Duration);
  'interval'?: (_google_protobuf_Duration);
  'interval_jitter'?: (_google_protobuf_Duration);
  'unhealthy_threshold'?: (_google_protobuf_UInt32Value);
  'healthy_threshold'?: (_google_protobuf_UInt32Value);
  'alt_port'?: (_google_protobuf_UInt32Value);
  'reuse_connection'?: (_google_protobuf_BoolValue);
  'http_health_check'?: (_envoy_api_v2_core_HealthCheck_HttpHealthCheck);
  'tcp_health_check'?: (_envoy_api_v2_core_HealthCheck_TcpHealthCheck);
  'grpc_health_check'?: (_envoy_api_v2_core_HealthCheck_GrpcHealthCheck);
  'no_traffic_interval'?: (_google_protobuf_Duration);
  'custom_health_check'?: (_envoy_api_v2_core_HealthCheck_CustomHealthCheck);
  'unhealthy_interval'?: (_google_protobuf_Duration);
  'unhealthy_edge_interval'?: (_google_protobuf_Duration);
  'healthy_edge_interval'?: (_google_protobuf_Duration);
  'event_log_path'?: (string);
  'interval_jitter_percent'?: (number);
  'always_log_health_check_failures'?: (boolean);
  'initial_jitter'?: (_google_protobuf_Duration);
  'tls_options'?: (_envoy_api_v2_core_HealthCheck_TlsOptions);
  'event_service'?: (_envoy_api_v2_core_EventServiceConfig);
  'health_checker'?: "http_health_check"|"tcp_health_check"|"grpc_health_check"|"custom_health_check";
}

export interface HealthCheck__Output {
  'timeout': (_google_protobuf_Duration__Output);
  'interval': (_google_protobuf_Duration__Output);
  'interval_jitter': (_google_protobuf_Duration__Output);
  'unhealthy_threshold': (_google_protobuf_UInt32Value__Output);
  'healthy_threshold': (_google_protobuf_UInt32Value__Output);
  'alt_port': (_google_protobuf_UInt32Value__Output);
  'reuse_connection': (_google_protobuf_BoolValue__Output);
  'http_health_check'?: (_envoy_api_v2_core_HealthCheck_HttpHealthCheck__Output);
  'tcp_health_check'?: (_envoy_api_v2_core_HealthCheck_TcpHealthCheck__Output);
  'grpc_health_check'?: (_envoy_api_v2_core_HealthCheck_GrpcHealthCheck__Output);
  'no_traffic_interval': (_google_protobuf_Duration__Output);
  'custom_health_check'?: (_envoy_api_v2_core_HealthCheck_CustomHealthCheck__Output);
  'unhealthy_interval': (_google_protobuf_Duration__Output);
  'unhealthy_edge_interval': (_google_protobuf_Duration__Output);
  'healthy_edge_interval': (_google_protobuf_Duration__Output);
  'event_log_path': (string);
  'interval_jitter_percent': (number);
  'always_log_health_check_failures': (boolean);
  'initial_jitter': (_google_protobuf_Duration__Output);
  'tls_options': (_envoy_api_v2_core_HealthCheck_TlsOptions__Output);
  'event_service': (_envoy_api_v2_core_EventServiceConfig__Output);
  'health_checker': "http_health_check"|"tcp_health_check"|"grpc_health_check"|"custom_health_check";
}
