// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto

import type { Resource as _envoy_service_discovery_v3_Resource, Resource__Output as _envoy_service_discovery_v3_Resource__Output } from '../../../../envoy/service/discovery/v3/Resource';
import type { ControlPlane as _envoy_config_core_v3_ControlPlane, ControlPlane__Output as _envoy_config_core_v3_ControlPlane__Output } from '../../../../envoy/config/core/v3/ControlPlane';
import type { ResourceName as _envoy_service_discovery_v3_ResourceName, ResourceName__Output as _envoy_service_discovery_v3_ResourceName__Output } from '../../../../envoy/service/discovery/v3/ResourceName';

/**
 * [#next-free-field: 9]
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
  /**
   * Alternative to removed_resources that allows specifying which variant of
   * a resource is being removed. This variant must be used for any resource
   * for which dynamic parameter constraints were sent to the client.
   */
  'removed_resource_names'?: (_envoy_service_discovery_v3_ResourceName)[];
}

/**
 * [#next-free-field: 9]
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
  /**
   * Alternative to removed_resources that allows specifying which variant of
   * a resource is being removed. This variant must be used for any resource
   * for which dynamic parameter constraints were sent to the client.
   */
  'removed_resource_names': (_envoy_service_discovery_v3_ResourceName__Output)[];
}
