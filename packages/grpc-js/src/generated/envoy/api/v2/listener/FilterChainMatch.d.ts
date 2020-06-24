// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { CidrRange as _envoy_api_v2_core_CidrRange, CidrRange__Output as _envoy_api_v2_core_CidrRange__Output } from '../../../../envoy/api/v2/core/CidrRange';

// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

export enum _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType {
  ANY = 0,
  LOCAL = 1,
  EXTERNAL = 2,
}

export interface FilterChainMatch {
  'destination_port'?: (_google_protobuf_UInt32Value);
  'prefix_ranges'?: (_envoy_api_v2_core_CidrRange)[];
  'address_suffix'?: (string);
  'suffix_len'?: (_google_protobuf_UInt32Value);
  'source_type'?: (_envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType | keyof typeof _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType);
  'source_prefix_ranges'?: (_envoy_api_v2_core_CidrRange)[];
  'source_ports'?: (number)[];
  'server_names'?: (string)[];
  'transport_protocol'?: (string);
  'application_protocols'?: (string)[];
}

export interface FilterChainMatch__Output {
  'destination_port': (_google_protobuf_UInt32Value__Output);
  'prefix_ranges': (_envoy_api_v2_core_CidrRange__Output)[];
  'address_suffix': (string);
  'suffix_len': (_google_protobuf_UInt32Value__Output);
  'source_type': (keyof typeof _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType);
  'source_prefix_ranges': (_envoy_api_v2_core_CidrRange__Output)[];
  'source_ports': (number)[];
  'server_names': (string)[];
  'transport_protocol': (string);
  'application_protocols': (string)[];
}
