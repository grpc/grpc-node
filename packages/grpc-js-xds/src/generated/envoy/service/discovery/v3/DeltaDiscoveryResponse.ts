// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto

import type { Resource as _envoy_service_discovery_v3_Resource, Resource__Output as _envoy_service_discovery_v3_Resource__Output } from '../../../../envoy/service/discovery/v3/Resource';
import type { ControlPlane as _envoy_config_core_v3_ControlPlane, ControlPlane__Output as _envoy_config_core_v3_ControlPlane__Output } from '../../../../envoy/config/core/v3/ControlPlane';

/**
 * [#next-free-field: 8]
 */
export interface DeltaDiscoveryResponse {
  /**
   * The version of the response data (used for debugging).
   */
  'system_version_info'?: (string);
  /**
   * The response resources. These are typed resources, whose types must match
   * the type_url field.
   */
  'resources'?: (_envoy_service_discovery_v3_Resource)[];
  /**
   * Type URL for resources. Identifies the xDS API when muxing over ADS.
   * Must be consistent with the type_url in the Any within 'resources' if 'resources' is non-empty.
   */
  'type_url'?: (string);
  /**
   * The nonce provides a way for DeltaDiscoveryRequests to uniquely
   * reference a DeltaDiscoveryResponse when (N)ACKing. The nonce is required.
   */
  'nonce'?: (string);
  /**
   * Resources names of resources that have be deleted and to be removed from the xDS Client.
   * Removed resources for missing resources can be ignored.
   */
  'removed_resources'?: (string)[];
  /**
   * [#not-implemented-hide:]
   * The control plane instance that sent the response.
   */
  'control_plane'?: (_envoy_config_core_v3_ControlPlane | null);
}

/**
 * [#next-free-field: 8]
 */
export interface DeltaDiscoveryResponse__Output {
  /**
   * The version of the response data (used for debugging).
   */
  'system_version_info': (string);
  /**
   * The response resources. These are typed resources, whose types must match
   * the type_url field.
   */
  'resources': (_envoy_service_discovery_v3_Resource__Output)[];
  /**
   * Type URL for resources. Identifies the xDS API when muxing over ADS.
   * Must be consistent with the type_url in the Any within 'resources' if 'resources' is non-empty.
   */
  'type_url': (string);
  /**
   * The nonce provides a way for DeltaDiscoveryRequests to uniquely
   * reference a DeltaDiscoveryResponse when (N)ACKing. The nonce is required.
   */
  'nonce': (string);
  /**
   * Resources names of resources that have be deleted and to be removed from the xDS Client.
   * Removed resources for missing resources can be ignored.
   */
  'removed_resources': (string)[];
  /**
   * [#not-implemented-hide:]
   * The control plane instance that sent the response.
   */
  'control_plane': (_envoy_config_core_v3_ControlPlane__Output | null);
}
