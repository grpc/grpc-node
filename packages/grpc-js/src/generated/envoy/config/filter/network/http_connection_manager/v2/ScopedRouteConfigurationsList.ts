// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

import { ScopedRouteConfiguration as _envoy_api_v2_ScopedRouteConfiguration, ScopedRouteConfiguration__Output as _envoy_api_v2_ScopedRouteConfiguration__Output } from '../../../../../../envoy/api/v2/ScopedRouteConfiguration';

/**
 * This message is used to work around the limitations with 'oneof' and repeated fields.
 */
export interface ScopedRouteConfigurationsList {
  'scoped_route_configurations'?: (_envoy_api_v2_ScopedRouteConfiguration)[];
}

/**
 * This message is used to work around the limitations with 'oneof' and repeated fields.
 */
export interface ScopedRouteConfigurationsList__Output {
  'scoped_route_configurations': (_envoy_api_v2_ScopedRouteConfiguration__Output)[];
}
