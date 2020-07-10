// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { CidrRange as _envoy_api_v2_core_CidrRange, CidrRange__Output as _envoy_api_v2_core_CidrRange__Output } from '../../../../envoy/api/v2/core/CidrRange';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

export enum _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType {
  ANY = 0,
  LOCAL = 1,
  EXTERNAL = 2,
}

export interface FilterChainMatch {
  'prefix_ranges'?: (_envoy_api_v2_core_CidrRange)[];
  'address_suffix'?: (string);
  'suffix_len'?: (_google_protobuf_UInt32Value);
  'source_prefix_ranges'?: (_envoy_api_v2_core_CidrRange)[];
  'source_ports'?: (number)[];
  'destination_port'?: (_google_protobuf_UInt32Value);
  'transport_protocol'?: (string);
  'application_protocols'?: (string)[];
  'server_names'?: (string)[];
  'source_type'?: (_envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType | keyof typeof _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType);
}

export interface FilterChainMatch__Output {
  'prefix_ranges': (_envoy_api_v2_core_CidrRange__Output)[];
  'address_suffix': (string);
  'suffix_len': (_google_protobuf_UInt32Value__Output);
  'source_prefix_ranges': (_envoy_api_v2_core_CidrRange__Output)[];
  'source_ports': (number)[];
  'destination_port': (_google_protobuf_UInt32Value__Output);
  'transport_protocol': (string);
  'application_protocols': (string)[];
  'server_names': (string)[];
  'source_type': (keyof typeof _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType);
}
