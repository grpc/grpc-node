// Original file: deps/envoy-api/envoy/service/status/v3/csds.proto

import type { NodeMatcher as _envoy_type_matcher_v3_NodeMatcher, NodeMatcher__Output as _envoy_type_matcher_v3_NodeMatcher__Output } from '../../../../envoy/type/matcher/v3/NodeMatcher';
import type { Node as _envoy_config_core_v3_Node, Node__Output as _envoy_config_core_v3_Node__Output } from '../../../../envoy/config/core/v3/Node';

/**
 * Request for client status of clients identified by a list of NodeMatchers.
 */
export interface ClientStatusRequest {
  /**
   * Management server can use these match criteria to identify clients.
   * The match follows OR semantics.
   */
  'node_matchers'?: (_envoy_type_matcher_v3_NodeMatcher)[];
  /**
   * The node making the csds request.
   */
  'node'?: (_envoy_config_core_v3_Node | null);
}

/**
 * Request for client status of clients identified by a list of NodeMatchers.
 */
export interface ClientStatusRequest__Output {
  /**
   * Management server can use these match criteria to identify clients.
   * The match follows OR semantics.
   */
  'node_matchers': (_envoy_type_matcher_v3_NodeMatcher__Output)[];
  /**
   * The node making the csds request.
   */
  'node': (_envoy_config_core_v3_Node__Output | null);
}
