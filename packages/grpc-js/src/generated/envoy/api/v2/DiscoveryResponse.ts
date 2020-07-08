// Original file: deps/envoy-api/envoy/api/v2/discovery.proto

import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import { ControlPlane as _envoy_api_v2_core_ControlPlane, ControlPlane__Output as _envoy_api_v2_core_ControlPlane__Output } from '../../../envoy/api/v2/core/ControlPlane';

export interface DiscoveryResponse {
  'version_info'?: (string);
  'resources'?: (_google_protobuf_Any)[];
  'canary'?: (boolean);
  'type_url'?: (string);
  'nonce'?: (string);
  'control_plane'?: (_envoy_api_v2_core_ControlPlane);
}

export interface DiscoveryResponse__Output {
  'version_info': (string);
  'resources': (_google_protobuf_Any__Output)[];
  'canary': (boolean);
  'type_url': (string);
  'nonce': (string);
  'control_plane': (_envoy_api_v2_core_ControlPlane__Output);
}
