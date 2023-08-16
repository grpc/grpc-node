// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto

import type { Node as _envoy_config_core_v3_Node, Node__Output as _envoy_config_core_v3_Node__Output } from '../../../../envoy/config/core/v3/Node';
import type { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../../google/rpc/Status';
import type { ResourceLocator as _envoy_service_discovery_v3_ResourceLocator, ResourceLocator__Output as _envoy_service_discovery_v3_ResourceLocator__Output } from '../../../../envoy/service/discovery/v3/ResourceLocator';

/**
 * DeltaDiscoveryRequest and DeltaDiscoveryResponse are used in a new gRPC
 * endpoint for Delta xDS.
 * 
 * With Delta xDS, the DeltaDiscoveryResponses do not need to include a full
 * snapshot of the tracked resources. Instead, DeltaDiscoveryResponses are a
 * diff to the state of a xDS client.
 * In Delta XDS there are per-resource versions, which allow tracking state at
 * the resource granularity.
 * An xDS Delta session is always in the context of a gRPC bidirectional
 * stream. This allows the xDS server to keep track of the state of xDS clients
 * connected to it.
 * 
 * In Delta xDS the nonce field is required and used to pair
 * DeltaDiscoveryResponse to a DeltaDiscoveryRequest ACK or NACK.
 * Optionally, a response message level system_version_info is present for
 * debugging purposes only.
 * 
 * DeltaDiscoveryRequest plays two independent roles. Any DeltaDiscoveryRequest
 * can be either or both of: [1] informing the server of what resources the
 * client has gained/lost interest in (using resource_names_subscribe and
 * resource_names_unsubscribe), or [2] (N)ACKing an earlier resource update from
 * the server (using response_nonce, with presence of error_detail making it a NACK).
 * Additionally, the first message (for a given type_url) of a reconnected gRPC stream
 * has a third role: informing the server of the resources (and their versions)
 * that the client already possesses, using the initial_resource_versions field.
 * 
 * As with state-of-the-world, when multiple resource types are multiplexed (ADS),
 * all requests/acknowledgments/updates are logically walled off by type_url:
 * a Cluster ACK exists in a completely separate world from a prior Route NACK.
 * In particular, initial_resource_versions being sent at the "start" of every
 * gRPC stream actually entails a message for each type_url, each with its own
 * initial_resource_versions.
 * [#next-free-field: 10]
 */
export interface DeltaDiscoveryRequest {
  /**
   * The node making the request.
   */
  'node'?: (_envoy_config_core_v3_Node | null);
  /**
   * Type of the resource that is being requested, e.g.
   * ``type.googleapis.com/envoy.api.v2.ClusterLoadAssignment``. This does not need to be set if
   * resources are only referenced via ``xds_resource_subscribe`` and
   * ``xds_resources_unsubscribe``.
   */
  'type_url'?: (string);
  /**
   * DeltaDiscoveryRequests allow the client to add or remove individual
   * resources to the set of tracked resources in the context of a stream.
   * All resource names in the resource_names_subscribe list are added to the
   * set of tracked resources and all resource names in the resource_names_unsubscribe
   * list are removed from the set of tracked resources.
   * 
   * *Unlike* state-of-the-world xDS, an empty resource_names_subscribe or
   * resource_names_unsubscribe list simply means that no resources are to be
   * added or removed to the resource list.
   * *Like* state-of-the-world xDS, the server must send updates for all tracked
   * resources, but can also send updates for resources the client has not subscribed to.
   * 
   * NOTE: the server must respond with all resources listed in resource_names_subscribe,
   * even if it believes the client has the most recent version of them. The reason:
   * the client may have dropped them, but then regained interest before it had a chance
   * to send the unsubscribe message. See DeltaSubscriptionStateTest.RemoveThenAdd.
   * 
   * These two fields can be set in any DeltaDiscoveryRequest, including ACKs
   * and initial_resource_versions.
   * 
   * A list of Resource names to add to the list of tracked resources.
   */
  'resource_names_subscribe'?: (string)[];
  /**
   * A list of Resource names to remove from the list of tracked resources.
   */
  'resource_names_unsubscribe'?: (string)[];
  /**
   * Informs the server of the versions of the resources the xDS client knows of, to enable the
   * client to continue the same logical xDS session even in the face of gRPC stream reconnection.
   * It will not be populated: [1] in the very first stream of a session, since the client will
   * not yet have any resources,  [2] in any message after the first in a stream (for a given
   * type_url), since the server will already be correctly tracking the client's state.
   * (In ADS, the first message *of each type_url* of a reconnected stream populates this map.)
   * The map's keys are names of xDS resources known to the xDS client.
   * The map's values are opaque resource versions.
   */
  'initial_resource_versions'?: ({[key: string]: string});
  /**
   * When the DeltaDiscoveryRequest is a ACK or NACK message in response
   * to a previous DeltaDiscoveryResponse, the response_nonce must be the
   * nonce in the DeltaDiscoveryResponse.
   * Otherwise (unlike in DiscoveryRequest) response_nonce must be omitted.
   */
  'response_nonce'?: (string);
  /**
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_v3_api_msg_service.discovery.v3.DiscoveryResponse>`
   * failed to update configuration. The ``message`` field in ``error_details``
   * provides the Envoy internal exception related to the failure.
   */
  'error_detail'?: (_google_rpc_Status | null);
  /**
   * [#not-implemented-hide:]
   * Alternative to ``resource_names_subscribe`` field that allows specifying dynamic parameters
   * along with each resource name.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names_subscribe`` and others in ``resource_locators_subscribe``.
   */
  'resource_locators_subscribe'?: (_envoy_service_discovery_v3_ResourceLocator)[];
  /**
   * [#not-implemented-hide:]
   * Alternative to ``resource_names_unsubscribe`` field that allows specifying dynamic parameters
   * along with each resource name.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names_unsubscribe`` and others in ``resource_locators_unsubscribe``.
   */
  'resource_locators_unsubscribe'?: (_envoy_service_discovery_v3_ResourceLocator)[];
}

/**
 * DeltaDiscoveryRequest and DeltaDiscoveryResponse are used in a new gRPC
 * endpoint for Delta xDS.
 * 
 * With Delta xDS, the DeltaDiscoveryResponses do not need to include a full
 * snapshot of the tracked resources. Instead, DeltaDiscoveryResponses are a
 * diff to the state of a xDS client.
 * In Delta XDS there are per-resource versions, which allow tracking state at
 * the resource granularity.
 * An xDS Delta session is always in the context of a gRPC bidirectional
 * stream. This allows the xDS server to keep track of the state of xDS clients
 * connected to it.
 * 
 * In Delta xDS the nonce field is required and used to pair
 * DeltaDiscoveryResponse to a DeltaDiscoveryRequest ACK or NACK.
 * Optionally, a response message level system_version_info is present for
 * debugging purposes only.
 * 
 * DeltaDiscoveryRequest plays two independent roles. Any DeltaDiscoveryRequest
 * can be either or both of: [1] informing the server of what resources the
 * client has gained/lost interest in (using resource_names_subscribe and
 * resource_names_unsubscribe), or [2] (N)ACKing an earlier resource update from
 * the server (using response_nonce, with presence of error_detail making it a NACK).
 * Additionally, the first message (for a given type_url) of a reconnected gRPC stream
 * has a third role: informing the server of the resources (and their versions)
 * that the client already possesses, using the initial_resource_versions field.
 * 
 * As with state-of-the-world, when multiple resource types are multiplexed (ADS),
 * all requests/acknowledgments/updates are logically walled off by type_url:
 * a Cluster ACK exists in a completely separate world from a prior Route NACK.
 * In particular, initial_resource_versions being sent at the "start" of every
 * gRPC stream actually entails a message for each type_url, each with its own
 * initial_resource_versions.
 * [#next-free-field: 10]
 */
export interface DeltaDiscoveryRequest__Output {
  /**
   * The node making the request.
   */
  'node': (_envoy_config_core_v3_Node__Output | null);
  /**
   * Type of the resource that is being requested, e.g.
   * ``type.googleapis.com/envoy.api.v2.ClusterLoadAssignment``. This does not need to be set if
   * resources are only referenced via ``xds_resource_subscribe`` and
   * ``xds_resources_unsubscribe``.
   */
  'type_url': (string);
  /**
   * DeltaDiscoveryRequests allow the client to add or remove individual
   * resources to the set of tracked resources in the context of a stream.
   * All resource names in the resource_names_subscribe list are added to the
   * set of tracked resources and all resource names in the resource_names_unsubscribe
   * list are removed from the set of tracked resources.
   * 
   * *Unlike* state-of-the-world xDS, an empty resource_names_subscribe or
   * resource_names_unsubscribe list simply means that no resources are to be
   * added or removed to the resource list.
   * *Like* state-of-the-world xDS, the server must send updates for all tracked
   * resources, but can also send updates for resources the client has not subscribed to.
   * 
   * NOTE: the server must respond with all resources listed in resource_names_subscribe,
   * even if it believes the client has the most recent version of them. The reason:
   * the client may have dropped them, but then regained interest before it had a chance
   * to send the unsubscribe message. See DeltaSubscriptionStateTest.RemoveThenAdd.
   * 
   * These two fields can be set in any DeltaDiscoveryRequest, including ACKs
   * and initial_resource_versions.
   * 
   * A list of Resource names to add to the list of tracked resources.
   */
  'resource_names_subscribe': (string)[];
  /**
   * A list of Resource names to remove from the list of tracked resources.
   */
  'resource_names_unsubscribe': (string)[];
  /**
   * Informs the server of the versions of the resources the xDS client knows of, to enable the
   * client to continue the same logical xDS session even in the face of gRPC stream reconnection.
   * It will not be populated: [1] in the very first stream of a session, since the client will
   * not yet have any resources,  [2] in any message after the first in a stream (for a given
   * type_url), since the server will already be correctly tracking the client's state.
   * (In ADS, the first message *of each type_url* of a reconnected stream populates this map.)
   * The map's keys are names of xDS resources known to the xDS client.
   * The map's values are opaque resource versions.
   */
  'initial_resource_versions': ({[key: string]: string});
  /**
   * When the DeltaDiscoveryRequest is a ACK or NACK message in response
   * to a previous DeltaDiscoveryResponse, the response_nonce must be the
   * nonce in the DeltaDiscoveryResponse.
   * Otherwise (unlike in DiscoveryRequest) response_nonce must be omitted.
   */
  'response_nonce': (string);
  /**
   * This is populated when the previous :ref:`DiscoveryResponse <envoy_v3_api_msg_service.discovery.v3.DiscoveryResponse>`
   * failed to update configuration. The ``message`` field in ``error_details``
   * provides the Envoy internal exception related to the failure.
   */
  'error_detail': (_google_rpc_Status__Output | null);
  /**
   * [#not-implemented-hide:]
   * Alternative to ``resource_names_subscribe`` field that allows specifying dynamic parameters
   * along with each resource name.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names_subscribe`` and others in ``resource_locators_subscribe``.
   */
  'resource_locators_subscribe': (_envoy_service_discovery_v3_ResourceLocator__Output)[];
  /**
   * [#not-implemented-hide:]
   * Alternative to ``resource_names_unsubscribe`` field that allows specifying dynamic parameters
   * along with each resource name.
   * Note that it is legal for a request to have some resources listed
   * in ``resource_names_unsubscribe`` and others in ``resource_locators_unsubscribe``.
   */
  'resource_locators_unsubscribe': (_envoy_service_discovery_v3_ResourceLocator__Output)[];
}
