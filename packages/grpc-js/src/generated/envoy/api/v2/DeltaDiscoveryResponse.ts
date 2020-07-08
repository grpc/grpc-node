// Original file: deps/envoy-api/envoy/api/v2/discovery.proto

import { Resource as _envoy_api_v2_Resource, Resource__Output as _envoy_api_v2_Resource__Output } from '../../../envoy/api/v2/Resource';

export interface DeltaDiscoveryResponse {
  'system_version_info'?: (string);
  'resources'?: (_envoy_api_v2_Resource)[];
  'type_url'?: (string);
  'removed_resources'?: (string)[];
  'nonce'?: (string);
}

export interface DeltaDiscoveryResponse__Output {
  'system_version_info': (string);
  'resources': (_envoy_api_v2_Resource__Output)[];
  'type_url': (string);
  'removed_resources': (string)[];
  'nonce': (string);
}
