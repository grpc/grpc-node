// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto

import type { Node as _envoy_config_core_v3_Node, Node__Output as _envoy_config_core_v3_Node__Output } from '../../../../envoy/config/core/v3/Node';
import type { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../../google/rpc/Status';
import type { ResourceLocator as _envoy_service_discovery_v3_ResourceLocator, ResourceLocator__Output as _envoy_service_discovery_v3_ResourceLocator__Output } from '../../../../envoy/service/discovery/v3/ResourceLocator';

/**
 * A DiscoveryRequest requests a set of versioned resources of the same type for
 * a given Envoy node on some API.
 * [#next-free-field: 8]
 */
export interface DiscoveryRequest {
  /**
   * The version_info provided in the request messages will be the version_info
   * received with the most recent successfully processed response or empty on
   * the first request. It is expected that no new request is sent after a
   * response is received until the Envoy instance is ready to ACK/NACK the new
   * configuration. ACK/NACK takes place by returning the new API config version
   * as applied or the previous API config version respectively. Each type_url
   * (see below) has an independent version associated with it.
   */
  'version_info'?: (string);
  /**
   * The node making the request.
   */
  'node'?: (_envoy_config_core_v3_Node | null);
  /**
   * List of resources to subscribe to, e.g. list of cluster names or a route
   * configuration name. If this is empty, all resources for the API are
   * returned. LDS/CDS may have empty resource_names, which will cause all
   * resources for the Envoy instance to be returned. The LDS and CDS responses
   * will then imply a number of resources that need to be fetched via EDS/RDS,
   * which will be explicitly enumerated in resource_names.
   */
  'resource_names'?: (string)[];
  /**
   * Type of the resource that is being requested, e.g.
   * "type.googleapis.com/envoy.api.v2.ClusterLoadAssignment". This is implicit
   * in requests made via singleton xDS APIs such as CDS, LDS, etc. but is
   * required for ADS.
   */
  'type_url'?: (string);
  /**
   * nonce corresponding to DiscoveryResponse being ACK/NACKed. See above
   * discussion on version_info and the DiscoveryResponse nonce comment. This
   * may be empty only if 1) this is a non-persistent-stream xDS such as HTTP,
   * or 2) the client has not yet accepted an update in this xDS stream (unlike
   * delta, where it is populated only for new explicit ACKs).
   */
  'response_nonce'?: (string);
  /**
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_v3_api_msg_service.discovery.v3.DiscoveryResponse>`
   * failed to update configuration. The ``message`` field in ``error_details`` provides the Envoy
   * internal exception related to the failure. It is only intended for consumption during manual
   * debugging, the string provided is not guaranteed to be stable across Envoy versions.
   */
  'error_detail'?: (_google_rpc_Status | null);
  /**
   * [#not-implemented-hide:]
   * Alternative to ``resource_names`` field that allows specifying dynamic
   * parameters along with each resource name. Clients that populate this
   * field must be able to handle responses from the server where resources
   * are wrapped in a Resource message.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names`` and others in ``resource_locators``.
   */
  'resource_locators'?: (_envoy_service_discovery_v3_ResourceLocator)[];
}

/**
 * A DiscoveryRequest requests a set of versioned resources of the same type for
 * a given Envoy node on some API.
 * [#next-free-field: 8]
 */
export interface DiscoveryRequest__Output {
  /**
   * The version_info provided in the request messages will be the version_info
   * received with the most recent successfully processed response or empty on
   * the first request. It is expected that no new request is sent after a
   * response is received until the Envoy instance is ready to ACK/NACK the new
   * configuration. ACK/NACK takes place by returning the new API config version
   * as applied or the previous API config version respectively. Each type_url
   * (see below) has an independent version associated with it.
   */
  'version_info': (string);
  /**
   * The node making the request.
   */
  'node': (_envoy_config_core_v3_Node__Output | null);
  /**
   * List of resources to subscribe to, e.g. list of cluster names or a route
   * configuration name. If this is empty, all resources for the API are
   * returned. LDS/CDS may have empty resource_names, which will cause all
   * resources for the Envoy instance to be returned. The LDS and CDS responses
   * will then imply a number of resources that need to be fetched via EDS/RDS,
   * which will be explicitly enumerated in resource_names.
   */
  'resource_names': (string)[];
  /**
   * Type of the resource that is being requested, e.g.
   * "type.googleapis.com/envoy.api.v2.ClusterLoadAssignment". This is implicit
   * in requests made via singleton xDS APIs such as CDS, LDS, etc. but is
   * required for ADS.
   */
  'type_url': (string);
  /**
   * nonce corresponding to DiscoveryResponse being ACK/NACKed. See above
   * discussion on version_info and the DiscoveryResponse nonce comment. This
   * may be empty only if 1) this is a non-persistent-stream xDS such as HTTP,
   * or 2) the client has not yet accepted an update in this xDS stream (unlike
   * delta, where it is populated only for new explicit ACKs).
   */
  'response_nonce': (string);
  /**
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_v3_api_msg_service.discovery.v3.DiscoveryResponse>`
   * failed to update configuration. The ``message`` field in ``error_details`` provides the Envoy
   * internal exception related to the failure. It is only intended for consumption during manual
   * debugging, the string provided is not guaranteed to be stable across Envoy versions.
   */
  'error_detail': (_google_rpc_Status__Output | null);
  /**
   * [#not-implemented-hide:]
   * Alternative to ``resource_names`` field that allows specifying dynamic
   * parameters along with each resource name. Clients that populate this
   * field must be able to handle responses from the server where resources
   * are wrapped in a Resource message.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names`` and others in ``resource_locators``.
   */
  'resource_locators': (_envoy_service_discovery_v3_ResourceLocator__Output)[];
}
