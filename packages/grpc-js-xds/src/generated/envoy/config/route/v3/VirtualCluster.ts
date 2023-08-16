// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { HeaderMatcher as _envoy_config_route_v3_HeaderMatcher, HeaderMatcher__Output as _envoy_config_route_v3_HeaderMatcher__Output } from '../../../../envoy/config/route/v3/HeaderMatcher';

/**
 * A virtual cluster is a way of specifying a regex matching rule against
 * certain important endpoints such that statistics are generated explicitly for
 * the matched requests. The reason this is useful is that when doing
 * prefix/path matching Envoy does not always know what the application
 * considers to be an endpoint. Thus, it’s impossible for Envoy to generically
 * emit per endpoint statistics. However, often systems have highly critical
 * endpoints that they wish to get “perfect” statistics on. Virtual cluster
 * statistics are perfect in the sense that they are emitted on the downstream
 * side such that they include network level failures.
 * 
 * Documentation for :ref:`virtual cluster statistics <config_http_filters_router_vcluster_stats>`.
 * 
 * .. note::
 * 
 * Virtual clusters are a useful tool, but we do not recommend setting up a virtual cluster for
 * every application endpoint. This is both not easily maintainable and as well the matching and
 * statistics output are not free.
 */
export interface VirtualCluster {
  /**
   * Specifies the name of the virtual cluster. The virtual cluster name as well
   * as the virtual host name are used when emitting statistics. The statistics are emitted by the
   * router filter and are documented :ref:`here <config_http_filters_router_stats>`.
   */
  'name'?: (string);
  /**
   * Specifies a list of header matchers to use for matching requests. Each specified header must
   * match. The pseudo-headers ``:path`` and ``:method`` can be used to match the request path and
   * method, respectively.
   */
  'headers'?: (_envoy_config_route_v3_HeaderMatcher)[];
}

/**
 * A virtual cluster is a way of specifying a regex matching rule against
 * certain important endpoints such that statistics are generated explicitly for
 * the matched requests. The reason this is useful is that when doing
 * prefix/path matching Envoy does not always know what the application
 * considers to be an endpoint. Thus, it’s impossible for Envoy to generically
 * emit per endpoint statistics. However, often systems have highly critical
 * endpoints that they wish to get “perfect” statistics on. Virtual cluster
 * statistics are perfect in the sense that they are emitted on the downstream
 * side such that they include network level failures.
 * 
 * Documentation for :ref:`virtual cluster statistics <config_http_filters_router_vcluster_stats>`.
 * 
 * .. note::
 * 
 * Virtual clusters are a useful tool, but we do not recommend setting up a virtual cluster for
 * every application endpoint. This is both not easily maintainable and as well the matching and
 * statistics output are not free.
 */
export interface VirtualCluster__Output {
  /**
   * Specifies the name of the virtual cluster. The virtual cluster name as well
   * as the virtual host name are used when emitting statistics. The statistics are emitted by the
   * router filter and are documented :ref:`here <config_http_filters_router_stats>`.
   */
  'name': (string);
  /**
   * Specifies a list of header matchers to use for matching requests. Each specified header must
   * match. The pseudo-headers ``:path`` and ``:method`` can be used to match the request path and
   * method, respectively.
   */
  'headers': (_envoy_config_route_v3_HeaderMatcher__Output)[];
}
