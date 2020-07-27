// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { RequestMethod as _envoy_api_v2_core_RequestMethod } from '../../../../envoy/api/v2/core/RequestMethod';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';

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
   * Specifies a regex pattern to use for matching requests. The entire path of the request
   * must match the regex. The regex grammar used is defined `here
   * <https://en.cppreference.com/w/cpp/regex/ecmascript>`_.
   * 
   * Examples:
   * 
   * * The regex ``/rides/\d+`` matches the path * /rides/0*
   * * The regex ``/rides/\d+`` matches the path * /rides/123*
   * * The regex ``/rides/\d+`` does not match the path * /rides/123/456*
   * 
   * .. attention::
   * This field has been deprecated in favor of `headers` as it is not safe for use with
   * untrusted input in all cases.
   */
  'pattern'?: (string);
  /**
   * Specifies the name of the virtual cluster. The virtual cluster name as well
   * as the virtual host name are used when emitting statistics. The statistics are emitted by the
   * router filter and are documented :ref:`here <config_http_filters_router_stats>`.
   */
  'name'?: (string);
  /**
   * Optionally specifies the HTTP method to match on. For example GET, PUT,
   * etc.
   * 
   * .. attention::
   * This field has been deprecated in favor of `headers`.
   */
  'method'?: (_envoy_api_v2_core_RequestMethod | keyof typeof _envoy_api_v2_core_RequestMethod);
  /**
   * Specifies a list of header matchers to use for matching requests. Each specified header must
   * match. The pseudo-headers `:path` and `:method` can be used to match the request path and
   * method, respectively.
   */
  'headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
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
   * Specifies a regex pattern to use for matching requests. The entire path of the request
   * must match the regex. The regex grammar used is defined `here
   * <https://en.cppreference.com/w/cpp/regex/ecmascript>`_.
   * 
   * Examples:
   * 
   * * The regex ``/rides/\d+`` matches the path * /rides/0*
   * * The regex ``/rides/\d+`` matches the path * /rides/123*
   * * The regex ``/rides/\d+`` does not match the path * /rides/123/456*
   * 
   * .. attention::
   * This field has been deprecated in favor of `headers` as it is not safe for use with
   * untrusted input in all cases.
   */
  'pattern': (string);
  /**
   * Specifies the name of the virtual cluster. The virtual cluster name as well
   * as the virtual host name are used when emitting statistics. The statistics are emitted by the
   * router filter and are documented :ref:`here <config_http_filters_router_stats>`.
   */
  'name': (string);
  /**
   * Optionally specifies the HTTP method to match on. For example GET, PUT,
   * etc.
   * 
   * .. attention::
   * This field has been deprecated in favor of `headers`.
   */
  'method': (keyof typeof _envoy_api_v2_core_RequestMethod);
  /**
   * Specifies a list of header matchers to use for matching requests. Each specified header must
   * match. The pseudo-headers `:path` and `:method` can be used to match the request path and
   * method, respectively.
   */
  'headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
}
