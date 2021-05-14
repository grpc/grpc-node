// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { ScopedRouteConfiguration as _envoy_config_route_v3_ScopedRouteConfiguration, ScopedRouteConfiguration__Output as _envoy_config_route_v3_ScopedRouteConfiguration__Output } from '../../../../../../envoy/config/route/v3/ScopedRouteConfiguration';

/**
 * This message is used to work around the limitations with 'oneof' and repeated fields.
 */
export interface ScopedRouteConfigurationsList {
  'scoped_route_configurations'?: (_envoy_config_route_v3_ScopedRouteConfiguration)[];
}

/**
 * This message is used to work around the limitations with 'oneof' and repeated fields.
 */
export interface ScopedRouteConfigurationsList__Output {
  'scoped_route_configurations': (_envoy_config_route_v3_ScopedRouteConfiguration__Output)[];
}
