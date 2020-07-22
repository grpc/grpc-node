// Original file: deps/envoy-api/envoy/api/v2/discovery.proto

import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import { ControlPlane as _envoy_api_v2_core_ControlPlane, ControlPlane__Output as _envoy_api_v2_core_ControlPlane__Output } from '../../../envoy/api/v2/core/ControlPlane';

/**
 * [#next-free-field: 7]
 */
export interface DiscoveryResponse {
  /**
   * The version of the response data.
   */
  'version_info'?: (string);
  /**
   * The response resources. These resources are typed and depend on the API being called.
   */
  'resources'?: (_google_protobuf_Any)[];
  /**
   * [#not-implemented-hide:]
   * Canary is used to support two Envoy command line flags:
   * 
   * * --terminate-on-canary-transition-failure. When set, Envoy is able to
   * terminate if it detects that configuration is stuck at canary. Consider
   * this example sequence of updates:
   * - Management server applies a canary config successfully.
   * - Management server rolls back to a production config.
   * - Envoy rejects the new production config.
   * Since there is no sensible way to continue receiving configuration
   * updates, Envoy will then terminate and apply production config from a
   * clean slate.
   * * --dry-run-canary. When set, a canary response will never be applied, only
   * validated via a dry run.
   */
  'canary'?: (boolean);
  /**
   * Type URL for resources. Identifies the xDS API when muxing over ADS.
   * Must be consistent with the type_url in the 'resources' repeated Any (if non-empty).
   */
  'type_url'?: (string);
  /**
   * For gRPC based subscriptions, the nonce provides a way to explicitly ack a
   * specific DiscoveryResponse in a following DiscoveryRequest. Additional
   * messages may have been sent by Envoy to the management server for the
   * previous version on the stream prior to this DiscoveryResponse, that were
   * unprocessed at response send time. The nonce allows the management server
   * to ignore any further DiscoveryRequests for the previous version until a
   * DiscoveryRequest bearing the nonce. The nonce is optional and is not
   * required for non-stream based xDS implementations.
   */
  'nonce'?: (string);
  /**
   * [#not-implemented-hide:]
   * The control plane instance that sent the response.
   */
  'control_plane'?: (_envoy_api_v2_core_ControlPlane);
}

/**
 * [#next-free-field: 7]
 */
export interface DiscoveryResponse__Output {
  /**
   * The version of the response data.
   */
  'version_info': (string);
  /**
   * The response resources. These resources are typed and depend on the API being called.
   */
  'resources': (_google_protobuf_Any__Output)[];
  /**
   * [#not-implemented-hide:]
   * Canary is used to support two Envoy command line flags:
   * 
   * * --terminate-on-canary-transition-failure. When set, Envoy is able to
   * terminate if it detects that configuration is stuck at canary. Consider
   * this example sequence of updates:
   * - Management server applies a canary config successfully.
   * - Management server rolls back to a production config.
   * - Envoy rejects the new production config.
   * Since there is no sensible way to continue receiving configuration
   * updates, Envoy will then terminate and apply production config from a
   * clean slate.
   * * --dry-run-canary. When set, a canary response will never be applied, only
   * validated via a dry run.
   */
  'canary': (boolean);
  /**
   * Type URL for resources. Identifies the xDS API when muxing over ADS.
   * Must be consistent with the type_url in the 'resources' repeated Any (if non-empty).
   */
  'type_url': (string);
  /**
   * For gRPC based subscriptions, the nonce provides a way to explicitly ack a
   * specific DiscoveryResponse in a following DiscoveryRequest. Additional
   * messages may have been sent by Envoy to the management server for the
   * previous version on the stream prior to this DiscoveryResponse, that were
   * unprocessed at response send time. The nonce allows the management server
   * to ignore any further DiscoveryRequests for the previous version until a
   * DiscoveryRequest bearing the nonce. The nonce is optional and is not
   * required for non-stream based xDS implementations.
   */
  'nonce': (string);
  /**
   * [#not-implemented-hide:]
   * The control plane instance that sent the response.
   */
  'control_plane'?: (_envoy_api_v2_core_ControlPlane__Output);
}
