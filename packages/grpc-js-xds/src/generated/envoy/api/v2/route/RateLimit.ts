// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';

/**
 * [#next-free-field: 7]
 */
export interface _envoy_api_v2_route_RateLimit_Action {
  /**
   * Rate limit on source cluster.
   */
  'source_cluster'?: (_envoy_api_v2_route_RateLimit_Action_SourceCluster);
  /**
   * Rate limit on destination cluster.
   */
  'destination_cluster'?: (_envoy_api_v2_route_RateLimit_Action_DestinationCluster);
  /**
   * Rate limit on request headers.
   */
  'request_headers'?: (_envoy_api_v2_route_RateLimit_Action_RequestHeaders);
  /**
   * Rate limit on remote address.
   */
  'remote_address'?: (_envoy_api_v2_route_RateLimit_Action_RemoteAddress);
  /**
   * Rate limit on a generic key.
   */
  'generic_key'?: (_envoy_api_v2_route_RateLimit_Action_GenericKey);
  /**
   * Rate limit on the existence of request headers.
   */
  'header_value_match'?: (_envoy_api_v2_route_RateLimit_Action_HeaderValueMatch);
  'action_specifier'?: "source_cluster"|"destination_cluster"|"request_headers"|"remote_address"|"generic_key"|"header_value_match";
}

/**
 * [#next-free-field: 7]
 */
export interface _envoy_api_v2_route_RateLimit_Action__Output {
  /**
   * Rate limit on source cluster.
   */
  'source_cluster'?: (_envoy_api_v2_route_RateLimit_Action_SourceCluster__Output);
  /**
   * Rate limit on destination cluster.
   */
  'destination_cluster'?: (_envoy_api_v2_route_RateLimit_Action_DestinationCluster__Output);
  /**
   * Rate limit on request headers.
   */
  'request_headers'?: (_envoy_api_v2_route_RateLimit_Action_RequestHeaders__Output);
  /**
   * Rate limit on remote address.
   */
  'remote_address'?: (_envoy_api_v2_route_RateLimit_Action_RemoteAddress__Output);
  /**
   * Rate limit on a generic key.
   */
  'generic_key'?: (_envoy_api_v2_route_RateLimit_Action_GenericKey__Output);
  /**
   * Rate limit on the existence of request headers.
   */
  'header_value_match'?: (_envoy_api_v2_route_RateLimit_Action_HeaderValueMatch__Output);
  'action_specifier': "source_cluster"|"destination_cluster"|"request_headers"|"remote_address"|"generic_key"|"header_value_match";
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("destination_cluster", "<routed target cluster>")
 * 
 * Once a request matches against a route table rule, a routed cluster is determined by one of
 * the following :ref:`route table configuration <envoy_api_msg_RouteConfiguration>`
 * settings:
 * 
 * * :ref:`cluster <envoy_api_field_route.RouteAction.cluster>` indicates the upstream cluster
 * to route to.
 * * :ref:`weighted_clusters <envoy_api_field_route.RouteAction.weighted_clusters>`
 * chooses a cluster randomly from a set of clusters with attributed weight.
 * * :ref:`cluster_header <envoy_api_field_route.RouteAction.cluster_header>` indicates which
 * header in the request contains the target cluster.
 */
export interface _envoy_api_v2_route_RateLimit_Action_DestinationCluster {
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("destination_cluster", "<routed target cluster>")
 * 
 * Once a request matches against a route table rule, a routed cluster is determined by one of
 * the following :ref:`route table configuration <envoy_api_msg_RouteConfiguration>`
 * settings:
 * 
 * * :ref:`cluster <envoy_api_field_route.RouteAction.cluster>` indicates the upstream cluster
 * to route to.
 * * :ref:`weighted_clusters <envoy_api_field_route.RouteAction.weighted_clusters>`
 * chooses a cluster randomly from a set of clusters with attributed weight.
 * * :ref:`cluster_header <envoy_api_field_route.RouteAction.cluster_header>` indicates which
 * header in the request contains the target cluster.
 */
export interface _envoy_api_v2_route_RateLimit_Action_DestinationCluster__Output {
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("generic_key", "<descriptor_value>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_GenericKey {
  /**
   * The value to use in the descriptor entry.
   */
  'descriptor_value'?: (string);
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("generic_key", "<descriptor_value>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_GenericKey__Output {
  /**
   * The value to use in the descriptor entry.
   */
  'descriptor_value': (string);
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("header_match", "<descriptor_value>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_HeaderValueMatch {
  /**
   * The value to use in the descriptor entry.
   */
  'descriptor_value'?: (string);
  /**
   * If set to true, the action will append a descriptor entry when the
   * request matches the headers. If set to false, the action will append a
   * descriptor entry when the request does not match the headers. The
   * default value is true.
   */
  'expect_match'?: (_google_protobuf_BoolValue);
  /**
   * Specifies a set of headers that the rate limit action should match
   * on. The action will check the request’s headers against all the
   * specified headers in the config. A match will happen if all the
   * headers in the config are present in the request with the same values
   * (or based on presence if the value field is not in the config).
   */
  'headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("header_match", "<descriptor_value>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_HeaderValueMatch__Output {
  /**
   * The value to use in the descriptor entry.
   */
  'descriptor_value': (string);
  /**
   * If set to true, the action will append a descriptor entry when the
   * request matches the headers. If set to false, the action will append a
   * descriptor entry when the request does not match the headers. The
   * default value is true.
   */
  'expect_match'?: (_google_protobuf_BoolValue__Output);
  /**
   * Specifies a set of headers that the rate limit action should match
   * on. The action will check the request’s headers against all the
   * specified headers in the config. A match will happen if all the
   * headers in the config are present in the request with the same values
   * (or based on presence if the value field is not in the config).
   */
  'headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
}

/**
 * The following descriptor entry is appended to the descriptor and is populated using the
 * trusted address from :ref:`x-forwarded-for <config_http_conn_man_headers_x-forwarded-for>`:
 * 
 * .. code-block:: cpp
 * 
 * ("remote_address", "<trusted address from x-forwarded-for>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_RemoteAddress {
}

/**
 * The following descriptor entry is appended to the descriptor and is populated using the
 * trusted address from :ref:`x-forwarded-for <config_http_conn_man_headers_x-forwarded-for>`:
 * 
 * .. code-block:: cpp
 * 
 * ("remote_address", "<trusted address from x-forwarded-for>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_RemoteAddress__Output {
}

/**
 * The following descriptor entry is appended when a header contains a key that matches the
 * *header_name*:
 * 
 * .. code-block:: cpp
 * 
 * ("<descriptor_key>", "<header_value_queried_from_header>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_RequestHeaders {
  /**
   * The header name to be queried from the request headers. The header’s
   * value is used to populate the value of the descriptor entry for the
   * descriptor_key.
   */
  'header_name'?: (string);
  /**
   * The key to use in the descriptor entry.
   */
  'descriptor_key'?: (string);
}

/**
 * The following descriptor entry is appended when a header contains a key that matches the
 * *header_name*:
 * 
 * .. code-block:: cpp
 * 
 * ("<descriptor_key>", "<header_value_queried_from_header>")
 */
export interface _envoy_api_v2_route_RateLimit_Action_RequestHeaders__Output {
  /**
   * The header name to be queried from the request headers. The header’s
   * value is used to populate the value of the descriptor entry for the
   * descriptor_key.
   */
  'header_name': (string);
  /**
   * The key to use in the descriptor entry.
   */
  'descriptor_key': (string);
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("source_cluster", "<local service cluster>")
 * 
 * <local service cluster> is derived from the :option:`--service-cluster` option.
 */
export interface _envoy_api_v2_route_RateLimit_Action_SourceCluster {
}

/**
 * The following descriptor entry is appended to the descriptor:
 * 
 * .. code-block:: cpp
 * 
 * ("source_cluster", "<local service cluster>")
 * 
 * <local service cluster> is derived from the :option:`--service-cluster` option.
 */
export interface _envoy_api_v2_route_RateLimit_Action_SourceCluster__Output {
}

/**
 * Global rate limiting :ref:`architecture overview <arch_overview_global_rate_limit>`.
 */
export interface RateLimit {
  /**
   * Refers to the stage set in the filter. The rate limit configuration only
   * applies to filters with the same stage number. The default stage number is
   * 0.
   * 
   * .. note::
   * 
   * The filter supports a range of 0 - 10 inclusively for stage numbers.
   */
  'stage'?: (_google_protobuf_UInt32Value);
  /**
   * The key to be set in runtime to disable this rate limit configuration.
   */
  'disable_key'?: (string);
  /**
   * A list of actions that are to be applied for this rate limit configuration.
   * Order matters as the actions are processed sequentially and the descriptor
   * is composed by appending descriptor entries in that sequence. If an action
   * cannot append a descriptor entry, no descriptor is generated for the
   * configuration. See :ref:`composing actions
   * <config_http_filters_rate_limit_composing_actions>` for additional documentation.
   */
  'actions'?: (_envoy_api_v2_route_RateLimit_Action)[];
}

/**
 * Global rate limiting :ref:`architecture overview <arch_overview_global_rate_limit>`.
 */
export interface RateLimit__Output {
  /**
   * Refers to the stage set in the filter. The rate limit configuration only
   * applies to filters with the same stage number. The default stage number is
   * 0.
   * 
   * .. note::
   * 
   * The filter supports a range of 0 - 10 inclusively for stage numbers.
   */
  'stage'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The key to be set in runtime to disable this rate limit configuration.
   */
  'disable_key': (string);
  /**
   * A list of actions that are to be applied for this rate limit configuration.
   * Order matters as the actions are processed sequentially and the descriptor
   * is composed by appending descriptor entries in that sequence. If an action
   * cannot append a descriptor entry, no descriptor is generated for the
   * configuration. See :ref:`composing actions
   * <config_http_filters_rate_limit_composing_actions>` for additional documentation.
   */
  'actions': (_envoy_api_v2_route_RateLimit_Action__Output)[];
}
