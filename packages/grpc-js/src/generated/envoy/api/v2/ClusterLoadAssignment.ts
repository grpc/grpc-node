// Original file: deps/envoy-api/envoy/api/v2/endpoint.proto

import { LocalityLbEndpoints as _envoy_api_v2_endpoint_LocalityLbEndpoints, LocalityLbEndpoints__Output as _envoy_api_v2_endpoint_LocalityLbEndpoints__Output } from '../../../envoy/api/v2/endpoint/LocalityLbEndpoints';
import { Endpoint as _envoy_api_v2_endpoint_Endpoint, Endpoint__Output as _envoy_api_v2_endpoint_Endpoint__Output } from '../../../envoy/api/v2/endpoint/Endpoint';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../google/protobuf/UInt32Value';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../google/protobuf/Duration';
import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from '../../../envoy/type/FractionalPercent';

export interface _envoy_api_v2_ClusterLoadAssignment_Policy {
  'drop_overloads'?: (_envoy_api_v2_ClusterLoadAssignment_Policy_DropOverload)[];
  'overprovisioning_factor'?: (_google_protobuf_UInt32Value);
  'endpoint_stale_after'?: (_google_protobuf_Duration);
  'disable_overprovisioning'?: (boolean);
}

export interface _envoy_api_v2_ClusterLoadAssignment_Policy__Output {
  'drop_overloads': (_envoy_api_v2_ClusterLoadAssignment_Policy_DropOverload__Output)[];
  'overprovisioning_factor': (_google_protobuf_UInt32Value__Output);
  'endpoint_stale_after': (_google_protobuf_Duration__Output);
  'disable_overprovisioning': (boolean);
}

export interface _envoy_api_v2_ClusterLoadAssignment_Policy_DropOverload {
  'category'?: (string);
  'drop_percentage'?: (_envoy_type_FractionalPercent);
}

export interface _envoy_api_v2_ClusterLoadAssignment_Policy_DropOverload__Output {
  'category': (string);
  'drop_percentage': (_envoy_type_FractionalPercent__Output);
}

export interface ClusterLoadAssignment {
  'cluster_name'?: (string);
  'endpoints'?: (_envoy_api_v2_endpoint_LocalityLbEndpoints)[];
  'named_endpoints'?: (_envoy_api_v2_endpoint_Endpoint);
  'policy'?: (_envoy_api_v2_ClusterLoadAssignment_Policy);
}

export interface ClusterLoadAssignment__Output {
  'cluster_name': (string);
  'endpoints': (_envoy_api_v2_endpoint_LocalityLbEndpoints__Output)[];
  'named_endpoints': (_envoy_api_v2_endpoint_Endpoint__Output);
  'policy': (_envoy_api_v2_ClusterLoadAssignment_Policy__Output);
}
