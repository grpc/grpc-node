// Original file: deps/envoy-api/envoy/api/v2/discovery.proto

import { Node as _envoy_api_v2_core_Node, Node__Output as _envoy_api_v2_core_Node__Output } from '../../../envoy/api/v2/core/Node';
import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';

export interface DeltaDiscoveryRequest {
  'node'?: (_envoy_api_v2_core_Node);
  'type_url'?: (string);
  'resource_names_subscribe'?: (string)[];
  'resource_names_unsubscribe'?: (string)[];
  'initial_resource_versions'?: (string);
  'response_nonce'?: (string);
  'error_detail'?: (_google_rpc_Status);
}

export interface DeltaDiscoveryRequest__Output {
  'node': (_envoy_api_v2_core_Node__Output);
  'type_url': (string);
  'resource_names_subscribe': (string)[];
  'resource_names_unsubscribe': (string)[];
  'initial_resource_versions': (string);
  'response_nonce': (string);
  'error_detail': (_google_rpc_Status__Output);
}
