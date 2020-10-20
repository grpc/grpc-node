// Original file: deps/envoy-api/envoy/api/v2/discovery.proto

import { Resource as _envoy_api_v2_Resource, Resource__Output as _envoy_api_v2_Resource__Output } from '../../../envoy/api/v2/Resource';

/**
 * [#next-free-field: 7]
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
  'resources'?: (_envoy_api_v2_Resource)[];
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
}

/**
 * [#next-free-field: 7]
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
  'resources': (_envoy_api_v2_Resource__Output)[];
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
}
