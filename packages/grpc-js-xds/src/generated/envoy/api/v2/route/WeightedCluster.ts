// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * [#next-free-field: 11]
 */
export interface _envoy_api_v2_route_WeightedCluster_ClusterWeight {
  /**
   * Name of the upstream cluster. The cluster must exist in the
   * :ref:`cluster manager configuration <config_cluster_manager>`.
   */
  'name'?: (string);
  /**
   * An integer between 0 and :ref:`total_weight
   * <envoy_api_field_route.WeightedCluster.total_weight>`. When a request matches the route,
   * the choice of an upstream cluster is determined by its weight. The sum of weights across all
   * entries in the clusters array must add up to the total_weight, which defaults to 100.
   */
  'weight'?: (_google_protobuf_UInt32Value);
  /**
   * Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in
   * the upstream cluster with metadata matching what is set in this field will be considered for
   * load balancing. Note that this will be merged with what's provided in
   * :ref:`RouteAction.metadata_match <envoy_api_field_route.RouteAction.metadata_match>`, with
   * values here taking precedence. The filter name should be specified as *envoy.lb*.
   */
  'metadata_match'?: (_envoy_api_v2_core_Metadata);
  /**
   * Specifies a list of headers to be added to requests when this cluster is selected
   * through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_api_msg_route.Route`, :ref:`envoy_api_msg_route.VirtualHost`, and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request when
   * this cluster is selected through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   */
  'request_headers_to_remove'?: (string)[];
  /**
   * Specifies a list of headers to be added to responses when this cluster is selected
   * through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_api_msg_route.Route`, :ref:`envoy_api_msg_route.VirtualHost`, and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * Specifies a list of headers to be removed from responses when this cluster is selected
   * through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   */
  'response_headers_to_remove'?: (string)[];
  /**
   * The per_filter_config field can be used to provide weighted cluster-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'per_filter_config'?: ({[key: string]: _google_protobuf_Struct});
  /**
   * The per_filter_config field can be used to provide weighted cluster-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'typed_per_filter_config'?: ({[key: string]: _google_protobuf_Any});
}

/**
 * [#next-free-field: 11]
 */
export interface _envoy_api_v2_route_WeightedCluster_ClusterWeight__Output {
  /**
   * Name of the upstream cluster. The cluster must exist in the
   * :ref:`cluster manager configuration <config_cluster_manager>`.
   */
  'name': (string);
  /**
   * An integer between 0 and :ref:`total_weight
   * <envoy_api_field_route.WeightedCluster.total_weight>`. When a request matches the route,
   * the choice of an upstream cluster is determined by its weight. The sum of weights across all
   * entries in the clusters array must add up to the total_weight, which defaults to 100.
   */
  'weight'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in
   * the upstream cluster with metadata matching what is set in this field will be considered for
   * load balancing. Note that this will be merged with what's provided in
   * :ref:`RouteAction.metadata_match <envoy_api_field_route.RouteAction.metadata_match>`, with
   * values here taking precedence. The filter name should be specified as *envoy.lb*.
   */
  'metadata_match'?: (_envoy_api_v2_core_Metadata__Output);
  /**
   * Specifies a list of headers to be added to requests when this cluster is selected
   * through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_api_msg_route.Route`, :ref:`envoy_api_msg_route.VirtualHost`, and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request when
   * this cluster is selected through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   */
  'request_headers_to_remove': (string)[];
  /**
   * Specifies a list of headers to be added to responses when this cluster is selected
   * through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_api_msg_route.Route`, :ref:`envoy_api_msg_route.VirtualHost`, and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * Specifies a list of headers to be removed from responses when this cluster is selected
   * through the enclosing :ref:`envoy_api_msg_route.RouteAction`.
   */
  'response_headers_to_remove': (string)[];
  /**
   * The per_filter_config field can be used to provide weighted cluster-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'per_filter_config'?: ({[key: string]: _google_protobuf_Struct__Output});
  /**
   * The per_filter_config field can be used to provide weighted cluster-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'typed_per_filter_config'?: ({[key: string]: _google_protobuf_Any__Output});
}

/**
 * Compared to the :ref:`cluster <envoy_api_field_route.RouteAction.cluster>` field that specifies a
 * single upstream cluster as the target of a request, the :ref:`weighted_clusters
 * <envoy_api_field_route.RouteAction.weighted_clusters>` option allows for specification of
 * multiple upstream clusters along with weights that indicate the percentage of
 * traffic to be forwarded to each cluster. The router selects an upstream cluster based on the
 * weights.
 */
export interface WeightedCluster {
  /**
   * Specifies one or more upstream clusters associated with the route.
   */
  'clusters'?: (_envoy_api_v2_route_WeightedCluster_ClusterWeight)[];
  /**
   * Specifies the runtime key prefix that should be used to construct the
   * runtime keys associated with each cluster. When the *runtime_key_prefix* is
   * specified, the router will look for weights associated with each upstream
   * cluster under the key *runtime_key_prefix* + "." + *cluster[i].name* where
   * *cluster[i]* denotes an entry in the clusters array field. If the runtime
   * key for the cluster does not exist, the value specified in the
   * configuration file will be used as the default weight. See the :ref:`runtime documentation
   * <operations_runtime>` for how key names map to the underlying implementation.
   */
  'runtime_key_prefix'?: (string);
  /**
   * Specifies the total weight across all clusters. The sum of all cluster weights must equal this
   * value, which must be greater than 0. Defaults to 100.
   */
  'total_weight'?: (_google_protobuf_UInt32Value);
}

/**
 * Compared to the :ref:`cluster <envoy_api_field_route.RouteAction.cluster>` field that specifies a
 * single upstream cluster as the target of a request, the :ref:`weighted_clusters
 * <envoy_api_field_route.RouteAction.weighted_clusters>` option allows for specification of
 * multiple upstream clusters along with weights that indicate the percentage of
 * traffic to be forwarded to each cluster. The router selects an upstream cluster based on the
 * weights.
 */
export interface WeightedCluster__Output {
  /**
   * Specifies one or more upstream clusters associated with the route.
   */
  'clusters': (_envoy_api_v2_route_WeightedCluster_ClusterWeight__Output)[];
  /**
   * Specifies the runtime key prefix that should be used to construct the
   * runtime keys associated with each cluster. When the *runtime_key_prefix* is
   * specified, the router will look for weights associated with each upstream
   * cluster under the key *runtime_key_prefix* + "." + *cluster[i].name* where
   * *cluster[i]* denotes an entry in the clusters array field. If the runtime
   * key for the cluster does not exist, the value specified in the
   * configuration file will be used as the default weight. See the :ref:`runtime documentation
   * <operations_runtime>` for how key names map to the underlying implementation.
   */
  'runtime_key_prefix': (string);
  /**
   * Specifies the total weight across all clusters. The sum of all cluster weights must equal this
   * value, which must be greater than 0. Defaults to 100.
   */
  'total_weight'?: (_google_protobuf_UInt32Value__Output);
}
