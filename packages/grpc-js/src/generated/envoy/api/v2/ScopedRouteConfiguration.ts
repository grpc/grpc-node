// Original file: deps/envoy-api/envoy/api/v2/scoped_route.proto


export interface _envoy_api_v2_ScopedRouteConfiguration_Key_Fragment {
  /**
   * A string to match against.
   */
  'string_key'?: (string);
  'type'?: "string_key";
}

export interface _envoy_api_v2_ScopedRouteConfiguration_Key_Fragment__Output {
  /**
   * A string to match against.
   */
  'string_key'?: (string);
  'type': "string_key";
}

/**
 * Specifies a key which is matched against the output of the
 * :ref:`scope_key_builder<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scope_key_builder>`
 * specified in the HttpConnectionManager. The matching is done per HTTP
 * request and is dependent on the order of the fragments contained in the
 * Key.
 */
export interface _envoy_api_v2_ScopedRouteConfiguration_Key {
  /**
   * The ordered set of fragments to match against. The order must match the
   * fragments in the corresponding
   * :ref:`scope_key_builder<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scope_key_builder>`.
   */
  'fragments'?: (_envoy_api_v2_ScopedRouteConfiguration_Key_Fragment)[];
}

/**
 * Specifies a key which is matched against the output of the
 * :ref:`scope_key_builder<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scope_key_builder>`
 * specified in the HttpConnectionManager. The matching is done per HTTP
 * request and is dependent on the order of the fragments contained in the
 * Key.
 */
export interface _envoy_api_v2_ScopedRouteConfiguration_Key__Output {
  /**
   * The ordered set of fragments to match against. The order must match the
   * fragments in the corresponding
   * :ref:`scope_key_builder<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scope_key_builder>`.
   */
  'fragments': (_envoy_api_v2_ScopedRouteConfiguration_Key_Fragment__Output)[];
}

/**
 * Specifies a routing scope, which associates a
 * :ref:`Key<envoy_api_msg_ScopedRouteConfiguration.Key>` to a
 * :ref:`envoy_api_msg_RouteConfiguration` (identified by its resource name).
 * 
 * The HTTP connection manager builds up a table consisting of these Key to
 * RouteConfiguration mappings, and looks up the RouteConfiguration to use per
 * request according to the algorithm specified in the
 * :ref:`scope_key_builder<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scope_key_builder>`
 * assigned to the HttpConnectionManager.
 * 
 * For example, with the following configurations (in YAML):
 * 
 * HttpConnectionManager config:
 * 
 * .. code::
 * 
 * ...
 * scoped_routes:
 * name: foo-scoped-routes
 * scope_key_builder:
 * fragments:
 * - header_value_extractor:
 * name: X-Route-Selector
 * element_separator: ,
 * element:
 * separator: =
 * key: vip
 * 
 * ScopedRouteConfiguration resources (specified statically via
 * :ref:`scoped_route_configurations_list<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scoped_route_configurations_list>`
 * or obtained dynamically via SRDS):
 * 
 * .. code::
 * 
 * (1)
 * name: route-scope1
 * route_configuration_name: route-config1
 * key:
 * fragments:
 * - string_key: 172.10.10.20
 * 
 * (2)
 * name: route-scope2
 * route_configuration_name: route-config2
 * key:
 * fragments:
 * - string_key: 172.20.20.30
 * 
 * A request from a client such as:
 * 
 * .. code::
 * 
 * GET / HTTP/1.1
 * Host: foo.com
 * X-Route-Selector: vip=172.10.10.20
 * 
 * would result in the routing table defined by the `route-config1`
 * RouteConfiguration being assigned to the HTTP request/stream.
 */
export interface ScopedRouteConfiguration {
  /**
   * The name assigned to the routing scope.
   */
  'name'?: (string);
  /**
   * The resource name to use for a :ref:`envoy_api_msg_DiscoveryRequest` to an
   * RDS server to fetch the :ref:`envoy_api_msg_RouteConfiguration` associated
   * with this scope.
   */
  'route_configuration_name'?: (string);
  /**
   * The key to match against.
   */
  'key'?: (_envoy_api_v2_ScopedRouteConfiguration_Key);
}

/**
 * Specifies a routing scope, which associates a
 * :ref:`Key<envoy_api_msg_ScopedRouteConfiguration.Key>` to a
 * :ref:`envoy_api_msg_RouteConfiguration` (identified by its resource name).
 * 
 * The HTTP connection manager builds up a table consisting of these Key to
 * RouteConfiguration mappings, and looks up the RouteConfiguration to use per
 * request according to the algorithm specified in the
 * :ref:`scope_key_builder<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scope_key_builder>`
 * assigned to the HttpConnectionManager.
 * 
 * For example, with the following configurations (in YAML):
 * 
 * HttpConnectionManager config:
 * 
 * .. code::
 * 
 * ...
 * scoped_routes:
 * name: foo-scoped-routes
 * scope_key_builder:
 * fragments:
 * - header_value_extractor:
 * name: X-Route-Selector
 * element_separator: ,
 * element:
 * separator: =
 * key: vip
 * 
 * ScopedRouteConfiguration resources (specified statically via
 * :ref:`scoped_route_configurations_list<envoy_api_field_config.filter.network.http_connection_manager.v2.ScopedRoutes.scoped_route_configurations_list>`
 * or obtained dynamically via SRDS):
 * 
 * .. code::
 * 
 * (1)
 * name: route-scope1
 * route_configuration_name: route-config1
 * key:
 * fragments:
 * - string_key: 172.10.10.20
 * 
 * (2)
 * name: route-scope2
 * route_configuration_name: route-config2
 * key:
 * fragments:
 * - string_key: 172.20.20.30
 * 
 * A request from a client such as:
 * 
 * .. code::
 * 
 * GET / HTTP/1.1
 * Host: foo.com
 * X-Route-Selector: vip=172.10.10.20
 * 
 * would result in the routing table defined by the `route-config1`
 * RouteConfiguration being assigned to the HTTP request/stream.
 */
export interface ScopedRouteConfiguration__Output {
  /**
   * The name assigned to the routing scope.
   */
  'name': (string);
  /**
   * The resource name to use for a :ref:`envoy_api_msg_DiscoveryRequest` to an
   * RDS server to fetch the :ref:`envoy_api_msg_RouteConfiguration` associated
   * with this scope.
   */
  'route_configuration_name': (string);
  /**
   * The key to match against.
   */
  'key'?: (_envoy_api_v2_ScopedRouteConfiguration_Key__Output);
}
