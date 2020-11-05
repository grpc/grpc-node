// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

import { ConfigSource as _envoy_api_v2_core_ConfigSource, ConfigSource__Output as _envoy_api_v2_core_ConfigSource__Output } from '../../../../../../envoy/api/v2/core/ConfigSource';
import { ScopedRouteConfigurationsList as _envoy_config_filter_network_http_connection_manager_v2_ScopedRouteConfigurationsList, ScopedRouteConfigurationsList__Output as _envoy_config_filter_network_http_connection_manager_v2_ScopedRouteConfigurationsList__Output } from '../../../../../../envoy/config/filter/network/http_connection_manager/v2/ScopedRouteConfigurationsList';
import { ScopedRds as _envoy_config_filter_network_http_connection_manager_v2_ScopedRds, ScopedRds__Output as _envoy_config_filter_network_http_connection_manager_v2_ScopedRds__Output } from '../../../../../../envoy/config/filter/network/http_connection_manager/v2/ScopedRds';

/**
 * Specifies the mechanism for constructing key fragments which are composed into scope keys.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder {
  /**
   * Specifies how a header field's value should be extracted.
   */
  'header_value_extractor'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor);
  'type'?: "header_value_extractor";
}

/**
 * Specifies the mechanism for constructing key fragments which are composed into scope keys.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder__Output {
  /**
   * Specifies how a header field's value should be extracted.
   */
  'header_value_extractor'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor__Output);
  'type': "header_value_extractor";
}

/**
 * Specifies how the value of a header should be extracted.
 * The following example maps the structure of a header to the fields in this message.
 * 
 * .. code::
 * 
 * <0> <1>   <-- index
 * X-Header: a=b;c=d
 * |         || |
 * |         || \----> <element_separator>
 * |         ||
 * |         |\----> <element.separator>
 * |         |
 * |         \----> <element.key>
 * |
 * \----> <name>
 * 
 * Each 'a=b' key-value pair constitutes an 'element' of the header field.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor {
  /**
   * The name of the header field to extract the value from.
   */
  'name'?: (string);
  /**
   * The element separator (e.g., ';' separates 'a;b;c;d').
   * Default: empty string. This causes the entirety of the header field to be extracted.
   * If this field is set to an empty string and 'index' is used in the oneof below, 'index'
   * must be set to 0.
   */
  'element_separator'?: (string);
  /**
   * Specifies the zero based index of the element to extract.
   * Note Envoy concatenates multiple values of the same header key into a comma separated
   * string, the splitting always happens after the concatenation.
   */
  'index'?: (number);
  /**
   * Specifies the key value pair to extract the value from.
   */
  'element'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement);
  'extract_type'?: "index"|"element";
}

/**
 * Specifies how the value of a header should be extracted.
 * The following example maps the structure of a header to the fields in this message.
 * 
 * .. code::
 * 
 * <0> <1>   <-- index
 * X-Header: a=b;c=d
 * |         || |
 * |         || \----> <element_separator>
 * |         ||
 * |         |\----> <element.separator>
 * |         |
 * |         \----> <element.key>
 * |
 * \----> <name>
 * 
 * Each 'a=b' key-value pair constitutes an 'element' of the header field.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor__Output {
  /**
   * The name of the header field to extract the value from.
   */
  'name': (string);
  /**
   * The element separator (e.g., ';' separates 'a;b;c;d').
   * Default: empty string. This causes the entirety of the header field to be extracted.
   * If this field is set to an empty string and 'index' is used in the oneof below, 'index'
   * must be set to 0.
   */
  'element_separator': (string);
  /**
   * Specifies the zero based index of the element to extract.
   * Note Envoy concatenates multiple values of the same header key into a comma separated
   * string, the splitting always happens after the concatenation.
   */
  'index'?: (number);
  /**
   * Specifies the key value pair to extract the value from.
   */
  'element'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement__Output);
  'extract_type': "index"|"element";
}

/**
 * Specifies a header field's key value pair to match on.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement {
  /**
   * The separator between key and value (e.g., '=' separates 'k=v;...').
   * If an element is an empty string, the element is ignored.
   * If an element contains no separator, the whole element is parsed as key and the
   * fragment value is an empty string.
   * If there are multiple values for a matched key, the first value is returned.
   */
  'separator'?: (string);
  /**
   * The key to match on.
   */
  'key'?: (string);
}

/**
 * Specifies a header field's key value pair to match on.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder_HeaderValueExtractor_KvElement__Output {
  /**
   * The separator between key and value (e.g., '=' separates 'k=v;...').
   * If an element is an empty string, the element is ignored.
   * If an element contains no separator, the whole element is parsed as key and the
   * fragment value is an empty string.
   * If there are multiple values for a matched key, the first value is returned.
   */
  'separator': (string);
  /**
   * The key to match on.
   */
  'key': (string);
}

/**
 * Specifies the mechanism for constructing "scope keys" based on HTTP request attributes. These
 * keys are matched against a set of :ref:`Key<envoy_api_msg_ScopedRouteConfiguration.Key>`
 * objects assembled from :ref:`ScopedRouteConfiguration<envoy_api_msg_ScopedRouteConfiguration>`
 * messages distributed via SRDS (the Scoped Route Discovery Service) or assigned statically via
 * :ref:`scoped_route_configurations_list<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scoped_route_configurations_list>`.
 * 
 * Upon receiving a request's headers, the Router will build a key using the algorithm specified
 * by this message. This key will be used to look up the routing table (i.e., the
 * :ref:`RouteConfiguration<envoy_api_msg_RouteConfiguration>`) to use for the request.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder {
  /**
   * The final(built) scope key consists of the ordered union of these fragments, which are compared in order with the
   * fragments of a :ref:`ScopedRouteConfiguration<envoy_api_msg_ScopedRouteConfiguration>`.
   * A missing fragment during comparison will make the key invalid, i.e., the computed key doesn't match any key.
   */
  'fragments'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder)[];
}

/**
 * Specifies the mechanism for constructing "scope keys" based on HTTP request attributes. These
 * keys are matched against a set of :ref:`Key<envoy_api_msg_ScopedRouteConfiguration.Key>`
 * objects assembled from :ref:`ScopedRouteConfiguration<envoy_api_msg_ScopedRouteConfiguration>`
 * messages distributed via SRDS (the Scoped Route Discovery Service) or assigned statically via
 * :ref:`scoped_route_configurations_list<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scoped_route_configurations_list>`.
 * 
 * Upon receiving a request's headers, the Router will build a key using the algorithm specified
 * by this message. This key will be used to look up the routing table (i.e., the
 * :ref:`RouteConfiguration<envoy_api_msg_RouteConfiguration>`) to use for the request.
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder__Output {
  /**
   * The final(built) scope key consists of the ordered union of these fragments, which are compared in order with the
   * fragments of a :ref:`ScopedRouteConfiguration<envoy_api_msg_ScopedRouteConfiguration>`.
   * A missing fragment during comparison will make the key invalid, i.e., the computed key doesn't match any key.
   */
  'fragments': (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder_FragmentBuilder__Output)[];
}

/**
 * [#next-free-field: 6]
 */
export interface ScopedRoutes {
  /**
   * The name assigned to the scoped routing configuration.
   */
  'name'?: (string);
  /**
   * The algorithm to use for constructing a scope key for each request.
   */
  'scope_key_builder'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder);
  /**
   * Configuration source specifier for RDS.
   * This config source is used to subscribe to RouteConfiguration resources specified in
   * ScopedRouteConfiguration messages.
   */
  'rds_config_source'?: (_envoy_api_v2_core_ConfigSource);
  /**
   * The set of routing scopes corresponding to the HCM. A scope is assigned to a request by
   * matching a key constructed from the request's attributes according to the algorithm specified
   * by the
   * :ref:`ScopeKeyBuilder<envoy_api_msg_config.filter.network.http_connection_manager.v2.ScopedRoutes.ScopeKeyBuilder>`
   * in this message.
   */
  'scoped_route_configurations_list'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRouteConfigurationsList);
  /**
   * The set of routing scopes associated with the HCM will be dynamically loaded via the SRDS
   * API. A scope is assigned to a request by matching a key constructed from the request's
   * attributes according to the algorithm specified by the
   * :ref:`ScopeKeyBuilder<envoy_api_msg_config.filter.network.http_connection_manager.v2.ScopedRoutes.ScopeKeyBuilder>`
   * in this message.
   */
  'scoped_rds'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRds);
  'config_specifier'?: "scoped_route_configurations_list"|"scoped_rds";
}

/**
 * [#next-free-field: 6]
 */
export interface ScopedRoutes__Output {
  /**
   * The name assigned to the scoped routing configuration.
   */
  'name': (string);
  /**
   * The algorithm to use for constructing a scope key for each request.
   */
  'scope_key_builder'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes_ScopeKeyBuilder__Output);
  /**
   * Configuration source specifier for RDS.
   * This config source is used to subscribe to RouteConfiguration resources specified in
   * ScopedRouteConfiguration messages.
   */
  'rds_config_source'?: (_envoy_api_v2_core_ConfigSource__Output);
  /**
   * The set of routing scopes corresponding to the HCM. A scope is assigned to a request by
   * matching a key constructed from the request's attributes according to the algorithm specified
   * by the
   * :ref:`ScopeKeyBuilder<envoy_api_msg_config.filter.network.http_connection_manager.v2.ScopedRoutes.ScopeKeyBuilder>`
   * in this message.
   */
  'scoped_route_configurations_list'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRouteConfigurationsList__Output);
  /**
   * The set of routing scopes associated with the HCM will be dynamically loaded via the SRDS
   * API. A scope is assigned to a request by matching a key constructed from the request's
   * attributes according to the algorithm specified by the
   * :ref:`ScopeKeyBuilder<envoy_api_msg_config.filter.network.http_connection_manager.v2.ScopedRoutes.ScopeKeyBuilder>`
   * in this message.
   */
  'scoped_rds'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRds__Output);
  'config_specifier': "scoped_route_configurations_list"|"scoped_rds";
}
