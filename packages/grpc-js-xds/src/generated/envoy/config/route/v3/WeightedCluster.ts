// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { HeaderValueOption as _envoy_config_core_v3_HeaderValueOption, HeaderValueOption__Output as _envoy_config_core_v3_HeaderValueOption__Output } from '../../../../envoy/config/core/v3/HeaderValueOption';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * [#next-free-field: 13]
 */
export interface _envoy_config_route_v3_WeightedCluster_ClusterWeight {
  /**
   * Only one of *name* and *cluster_header* may be specified.
   * [#next-major-version: Need to add back the validation rule: (validate.rules).string = {min_len: 1}]
   * Name of the upstream cluster. The cluster must exist in the
   * :ref:`cluster manager configuration <config_cluster_manager>`.
   */
  'name'?: (string);
  /**
   * Only one of *name* and *cluster_header* may be specified.
   * [#next-major-version: Need to add back the validation rule: (validate.rules).string = {min_len: 1 }]
   * Envoy will determine the cluster to route to by reading the value of the
   * HTTP header named by cluster_header from the request headers. If the
   * header is not found or the referenced cluster does not exist, Envoy will
   * return a 404 response.
   * 
   * .. attention::
   * 
   * Internally, Envoy always uses the HTTP/2 *:authority* header to represent the HTTP/1
   * *Host* header. Thus, if attempting to match on *Host*, match on *:authority* instead.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'cluster_header'?: (string);
  /**
   * An integer between 0 and :ref:`total_weight
   * <envoy_v3_api_field_config.route.v3.WeightedCluster.total_weight>`. When a request matches the route,
   * the choice of an upstream cluster is determined by its weight. The sum of weights across all
   * entries in the clusters array must add up to the total_weight, which defaults to 100.
   */
  'weight'?: (_google_protobuf_UInt32Value | null);
  /**
   * Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in
   * the upstream cluster with metadata matching what is set in this field will be considered for
   * load balancing. Note that this will be merged with what's provided in
   * :ref:`RouteAction.metadata_match <envoy_v3_api_field_config.route.v3.RouteAction.metadata_match>`, with
   * values here taking precedence. The filter name should be specified as *envoy.lb*.
   */
  'metadata_match'?: (_envoy_config_core_v3_Metadata | null);
  /**
   * Specifies a list of headers to be added to requests when this cluster is selected
   * through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_v3_api_msg_config.route.v3.Route`, :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`, and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request when
   * this cluster is selected through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   */
  'request_headers_to_remove'?: (string)[];
  /**
   * Specifies a list of headers to be added to responses when this cluster is selected
   * through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_v3_api_msg_config.route.v3.Route`, :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`, and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * Specifies a list of headers to be removed from responses when this cluster is selected
   * through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   */
  'response_headers_to_remove'?: (string)[];
  /**
   * The per_filter_config field can be used to provide weighted cluster-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   * [#comment: An entry's value may be wrapped in a
   * :ref:`FilterConfig<envoy_v3_api_msg_config.route.v3.FilterConfig>`
   * message to specify additional options.]
   */
  'typed_per_filter_config'?: ({[key: string]: _google_protobuf_Any});
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * this value.
   */
  'host_rewrite_literal'?: (string);
  'host_rewrite_specifier'?: "host_rewrite_literal";
}

/**
 * [#next-free-field: 13]
 */
export interface _envoy_config_route_v3_WeightedCluster_ClusterWeight__Output {
  /**
   * Only one of *name* and *cluster_header* may be specified.
   * [#next-major-version: Need to add back the validation rule: (validate.rules).string = {min_len: 1}]
   * Name of the upstream cluster. The cluster must exist in the
   * :ref:`cluster manager configuration <config_cluster_manager>`.
   */
  'name': (string);
  /**
   * Only one of *name* and *cluster_header* may be specified.
   * [#next-major-version: Need to add back the validation rule: (validate.rules).string = {min_len: 1 }]
   * Envoy will determine the cluster to route to by reading the value of the
   * HTTP header named by cluster_header from the request headers. If the
   * header is not found or the referenced cluster does not exist, Envoy will
   * return a 404 response.
   * 
   * .. attention::
   * 
   * Internally, Envoy always uses the HTTP/2 *:authority* header to represent the HTTP/1
   * *Host* header. Thus, if attempting to match on *Host*, match on *:authority* instead.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'cluster_header': (string);
  /**
   * An integer between 0 and :ref:`total_weight
   * <envoy_v3_api_field_config.route.v3.WeightedCluster.total_weight>`. When a request matches the route,
   * the choice of an upstream cluster is determined by its weight. The sum of weights across all
   * entries in the clusters array must add up to the total_weight, which defaults to 100.
   */
  'weight': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints in
   * the upstream cluster with metadata matching what is set in this field will be considered for
   * load balancing. Note that this will be merged with what's provided in
   * :ref:`RouteAction.metadata_match <envoy_v3_api_field_config.route.v3.RouteAction.metadata_match>`, with
   * values here taking precedence. The filter name should be specified as *envoy.lb*.
   */
  'metadata_match': (_envoy_config_core_v3_Metadata__Output | null);
  /**
   * Specifies a list of headers to be added to requests when this cluster is selected
   * through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_v3_api_msg_config.route.v3.Route`, :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`, and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request when
   * this cluster is selected through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   */
  'request_headers_to_remove': (string)[];
  /**
   * Specifies a list of headers to be added to responses when this cluster is selected
   * through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   * Headers specified at this level are applied before headers from the enclosing
   * :ref:`envoy_v3_api_msg_config.route.v3.Route`, :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`, and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * Specifies a list of headers to be removed from responses when this cluster is selected
   * through the enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`.
   */
  'response_headers_to_remove': (string)[];
  /**
   * The per_filter_config field can be used to provide weighted cluster-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   * [#comment: An entry's value may be wrapped in a
   * :ref:`FilterConfig<envoy_v3_api_msg_config.route.v3.FilterConfig>`
   * message to specify additional options.]
   */
  'typed_per_filter_config': ({[key: string]: _google_protobuf_Any__Output});
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * this value.
   */
  'host_rewrite_literal'?: (string);
  'host_rewrite_specifier': "host_rewrite_literal";
}

/**
 * Compared to the :ref:`cluster <envoy_v3_api_field_config.route.v3.RouteAction.cluster>` field that specifies a
 * single upstream cluster as the target of a request, the :ref:`weighted_clusters
 * <envoy_v3_api_field_config.route.v3.RouteAction.weighted_clusters>` option allows for specification of
 * multiple upstream clusters along with weights that indicate the percentage of
 * traffic to be forwarded to each cluster. The router selects an upstream cluster based on the
 * weights.
 */
export interface WeightedCluster {
  /**
   * Specifies one or more upstream clusters associated with the route.
   */
  'clusters'?: (_envoy_config_route_v3_WeightedCluster_ClusterWeight)[];
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
  'total_weight'?: (_google_protobuf_UInt32Value | null);
}

/**
 * Compared to the :ref:`cluster <envoy_v3_api_field_config.route.v3.RouteAction.cluster>` field that specifies a
 * single upstream cluster as the target of a request, the :ref:`weighted_clusters
 * <envoy_v3_api_field_config.route.v3.RouteAction.weighted_clusters>` option allows for specification of
 * multiple upstream clusters along with weights that indicate the percentage of
 * traffic to be forwarded to each cluster. The router selects an upstream cluster based on the
 * weights.
 */
export interface WeightedCluster__Output {
  /**
   * Specifies one or more upstream clusters associated with the route.
   */
  'clusters': (_envoy_config_route_v3_WeightedCluster_ClusterWeight__Output)[];
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
  'total_weight': (_google_protobuf_UInt32Value__Output | null);
}
